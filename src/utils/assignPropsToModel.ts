abstract class BaseClass {}

const assignPropsToModel = <M extends BaseClass>(model: M, values: Partial<M>): M => {
  Object.assign(model, values);
  return model;
};

export default assignPropsToModel;
