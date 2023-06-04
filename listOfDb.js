function generateRandomPassword() {
  const specialChars = "@#$%^*=<>";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const passwordLength = 30;

  const allChars = specialChars + uppercaseLetters + lowercaseLetters + numbers;

  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars.charAt(randomIndex);
  }

  return password;
}

const databases = [
  {
    dbName: "user_management_stage1",
    userName: "user_management_role",
    password: generateRandomPassword(),
  },
  {
    dbName: "activity_logs_stage1",
    userName: "activity_logs_role",
    password: generateRandomPassword(),
  },
];
console.log(databases);

module.exports.dbList = databases;
