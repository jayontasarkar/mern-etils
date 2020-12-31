exports.cleanUpEmailList = (emails) => {
  const list = emails
    .map((email) => String(email.trim().toLowerCase()))
    .filter((email) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    });

  const validatedLists = list.filter(
    (item, index) => list.indexOf(item) === index
  );

  return validatedLists;
};
