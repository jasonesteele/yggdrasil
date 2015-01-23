package yggdrasil.dao;

import java.io.Serializable;

import javax.transaction.Transactional;

/**
 * Implementations of this interface provide base data access operations for an
 * entity type.
 *
 * @author jason
 * @param <T>
 *          entity type
 * @param <PK>
 *          primary key type
 */
@Transactional
public interface AbstractDao<T, PK extends Serializable> {
  /**
   * Creates a new persistent object.
   *
   * @param entity
   *          values to use in creating entity
   * @return entity object with any modifications made by the persistence layer
   */
  T create(T entity);

  /**
   * Deletes an entity.
   *
   * @param key
   *          primary key for entity
   */
  void delete(PK key);

  /**
   * Retrieves an entity.
   *
   * @param key
   *          primary key for entity
   * @return entity object
   */
  T get(PK key);

  /**
   * Updates an entity object.
   *
   * @param entity
   *          entity to save
   */
  void update(T entity);
}
