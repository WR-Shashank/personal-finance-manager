package com.syfe.personalfinancemanager.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Every category the user may file against: the system defaults plus their own.
     * Defaults first, then alphabetical, so the response order is stable.
     */
    @Query("""
           SELECT c FROM Category c
           WHERE c.owner IS NULL OR c.owner.id = :userId
           ORDER BY CASE WHEN c.owner IS NULL THEN 0 ELSE 1 END, c.name
           """)
    List<Category> findAllVisibleTo(@Param("userId") Long userId);

    /** Resolves a category by name within the user's visible set. Names are matched case-insensitively. */
    @Query("""
           SELECT c FROM Category c
           WHERE LOWER(c.name) = LOWER(:name)
             AND (c.owner IS NULL OR c.owner.id = :userId)
           """)
    Optional<Category> findVisibleByName(@Param("name") String name, @Param("userId") Long userId);

    @Query("""
           SELECT COUNT(c) > 0 FROM Category c
           WHERE LOWER(c.name) = LOWER(:name)
             AND (c.owner IS NULL OR c.owner.id = :userId)
           """)
    boolean existsVisibleByName(@Param("name") String name, @Param("userId") Long userId);

    Optional<Category> findByNameIgnoreCaseAndOwnerIsNull(String name);

    List<Category> findByOwnerIsNull();
}
