function useValidation<T>(
  initialObject: T,
  ids?: string[] | null
): {
  isValid: boolean;
} {
  let isValid = true;

  for (const key in initialObject) {
    if (initialObject.hasOwnProperty(key)) {
      const value = initialObject[key];
      if (value == null && value == undefined) {
        isValid = false;
        //This validation is to make sure that the client is receiving the data, if not it should be sent to the company, but here it will only be a console.error
        console.error(
          `Error this ${key} information is not valid, ids: ${ids}`
        );
      }
    }
  }

  return { isValid };
}

export default useValidation;
