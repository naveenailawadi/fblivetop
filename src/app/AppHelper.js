export const isValidEmail = email => {
    if (!email) return false;

    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const handlePressEnter = (evt, callback) => {
    if (evt.which === 13 || evt.keyCode === 13) {
      // code to execute here
      return callback();
    }
    return false;
  };