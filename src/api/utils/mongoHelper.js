import jsonpatch from 'fast-json-patch';

function patchUpdates(patches) {
  return (entity) => {
    try {
      jsonpatch.applyPatch(entity, patches, /* validate */ true);
    } catch (err) {
      return Promise.reject(err);
    }
    return entity.save();
  };
}

export default patchUpdates;
