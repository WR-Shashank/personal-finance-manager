package com.syfe.personalfinancemanager.category;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Inserts the system default categories once at startup, if they are not
 * already present.
 * <p>
 * Seeding at startup rather than per registration means the defaults exist as
 * exactly one row each: no duplication across accounts, and no risk of two
 * users' "Rent" drifting apart.
 */
@Component
@RequiredArgsConstructor
public class DefaultCategorySeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DefaultCategorySeeder.class);

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        int created = 0;
        for (var entry : DefaultCategories.CATALOGUE) {
            if (categoryRepository.findByNameIgnoreCaseAndOwnerIsNull(entry.getKey()).isEmpty()) {
                categoryRepository.save(Category.builder()
                        .name(entry.getKey())
                        .type(entry.getValue())
                        .owner(null)
                        .build());
                created++;
            }
        }
        log.info("Default categories seeded: {} created, {} total in catalogue",
                created, DefaultCategories.CATALOGUE.size());
    }
}
