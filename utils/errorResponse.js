
class ErrorResponse extends Error {
    constructor(message, status) {
      super(message); // The message property is inherited from Error
      this.status = status; // Adding a custom status property
    }
  }

export default ErrorResponse