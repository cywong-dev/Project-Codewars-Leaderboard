const { extractAvailableLanguages } = require("./script");

const mockUsersData = [
  {
    username: "aaa",
    clan: "CYF",
    ranks: {
      overall: { score: 1500 },
      languages: {
        JavaScript: { score: 1300 },
        Python: { score: 200 },
      },
    },
  },
];

test.only("extractAvailableLanguages returns a sorted list of unique languages", () => {
  const languages = extractAvailableLanguages(mockUsersData);
  expect(languages).toEqual(["JavaScript", "Python"]);
});
