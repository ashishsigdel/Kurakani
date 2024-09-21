class ApiError extends Error {
  constructor({
    status = 500,
    message = "Something went wrong",
    data = null,
    errors = null,
    stack = "",
  }) {
    super(message);
    this.status = status;
    if (data) this.data = data;
    this.message = message;
    if (errors) this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
