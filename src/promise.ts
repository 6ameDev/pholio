function toPromise<T>(callback): Promise<T> {
  const promise = new Promise<T>((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

export default toPromise;
