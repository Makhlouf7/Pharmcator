export const getFormData = (formEl) => {
  const formData = new FormData(formEl);
  const formObj = {};
  formData.forEach((value, key) => (formObj[key] = value));
  return formObj;
};
