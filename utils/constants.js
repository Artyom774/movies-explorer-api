const URLregex = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/; // регулярка для URL-адреса
const idRegex = /[0-9a-f]+/; // регулярка для _id в MongoDB

module.exports = { URLregex, idRegex };
