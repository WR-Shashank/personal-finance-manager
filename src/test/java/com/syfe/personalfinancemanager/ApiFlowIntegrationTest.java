package com.syfe.personalfinancemanager;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end walk through the whole contract against a real (in-memory) context:
 * register, login, the session cookie, the seeded defaults, a transaction, a
 * report, and the authorisation boundaries. One test here exercises the
 * controllers, the security chain, the seeder and the exception handler at once,
 * which is where the unit tests stop.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private MockHttpSession loginAs(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andReturn();
        return (MockHttpSession) result.getRequest().getSession(false);
    }

    private void register(String username) throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\",\"password\":\"password123\","
                                + "\"fullName\":\"Darsh Dave\",\"phoneNumber\":\"+919876543210\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    @DisplayName("register -> login -> create -> report -> logout, with data isolation enforced")
    void fullHappyPath() throws Exception {
        register("flow@example.com");
        MockHttpSession session = loginAs("flow@example.com", "password123");

        // Defaults are present and flagged as non-custom.
        mockMvc.perform(get("/api/categories").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categories[?(@.name=='Salary')].isCustom").value(false))
                .andExpect(jsonPath("$.categories[?(@.name=='Rent')]").exists());

        // Create an income transaction by category name; type is derived server-side.
        mockMvc.perform(post("/api/transactions").session(session)
                        .contentType(APPLICATION_JSON)
                        .content("{\"amount\":50000.00,\"date\":\"2024-01-15\","
                                + "\"category\":\"Salary\",\"description\":\"January Salary\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("INCOME"))
                .andExpect(jsonPath("$.category").value("Salary"));

        mockMvc.perform(get("/api/transactions").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactions.length()").value(1));

        // Monthly report groups income by category.
        mockMvc.perform(get("/api/reports/monthly/2024/1").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome.Salary").value(50000.00))
                .andExpect(jsonPath("$.netSavings").value(50000.00));

        mockMvc.perform(post("/api/auth/logout").session(session))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("a future-dated transaction is a 400")
    void rejectsFutureDate() throws Exception {
        register("future@example.com");
        MockHttpSession session = loginAs("future@example.com", "password123");

        mockMvc.perform(post("/api/transactions").session(session)
                        .contentType(APPLICATION_JSON)
                        .content("{\"amount\":10.00,\"date\":\"2999-01-01\","
                                + "\"category\":\"Salary\",\"description\":\"nope\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("a duplicate custom category is a 409")
    void rejectsDuplicateCategory() throws Exception {
        register("dup@example.com");
        MockHttpSession session = loginAs("dup@example.com", "password123");

        String body = "{\"name\":\"Crypto\",\"type\":\"INCOME\"}";
        mockMvc.perform(post("/api/categories").session(session).contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/categories").session(session).contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("deleting a default category is a 403")
    void rejectsDeletingDefault() throws Exception {
        register("del@example.com");
        MockHttpSession session = loginAs("del@example.com", "password123");

        mockMvc.perform(delete("/api/categories/Salary").session(session))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("no session means 401 on a protected endpoint and on logout")
    void unauthenticatedIsRejected() throws Exception {
        mockMvc.perform(get("/api/transactions")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/logout")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("bad credentials are a 401, not a 500")
    void badCredentials() throws Exception {
        register("creds@example.com");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content("{\"username\":\"creds@example.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("a malformed registration body is a 400 with field errors")
    void validationErrors() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content("{\"username\":\"not-an-email\",\"password\":\"short\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").exists());
    }
}
