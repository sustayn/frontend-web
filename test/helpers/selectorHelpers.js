export function createEntityState(entity, entityObject) {
  return {
    entities: {
      [entity]: entityObject,
    },
  };
}

export function createIdProps(id) {
  return {
    params: { id },
  };
}