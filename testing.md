# TESTING.md - Verification & Testing Documentation

This document explains how each requirement and rubric item for the *Codewars Leaderboard* application was tested and verified.

---


Rubric Requirement / Criteria 
Testing Strategy & Method 
Detailed Explanation 
Actual Result
------------------------------
1. Input for comma-separated list of users
- Manual UI Testing
- Verified in the browser by entering single usernames (`CodeYourFuture`), multiple comma-separated usernames (`CodeYourFuture, 40thieves, SallyMcGrath`), and usernames with trailing/leading spaces. 
-  Confirmed that input parsing correctly splits and trims user entries. 

2. Submitting list fetches data from Codewars API
- Manual & DevTools Network Testing
- Tested by submitting valid usernames and inspecting the Chrome DevTools 
- Confirmed requests for each parsed user.
 
3. Drop-down shows all available language rankings plus overall ranking 
- Unit tests in `script.test.js` 
- Tested using Jest unit tests targeting `extractAvailableLanguages()` in `script.test.js`.
- The test passes

4. Default ranking selected is overall ranking
- Manual UI Testing
- Verified that upon form submission and initial table render, the dropdown defaults to `<option value="overall">Overall Ranking</option>`
- Default ranking selected is overall ranking.

5. Table shows username, clan, and score columns
- Manual UI Testing
- Inspected the generated table DOM structure
- Confirmed table headers (`<th>`) and body cells (`<td>`) explicitly map to `Username`, `Clan`, and `Score`. Users without a clan correctly fall back to rendering `-`. 

6. Changing selected ranking updates table
- Manual UI testing 
- Change the dropdown selection
- Confirmed that selecting a new option in the dropdown updates the table instantly. 

7. Table is sorted from highest to lowest score
- Manual UI testing
- Check the scores manually
- Confirmed that the table is sorted From highest to lowest score.

8. Top user's score is visually highlighted** 
- Manual UI Testing
- Verified in the browser after rendering
- The first row (`index === 0`) receives the `winner`.

9. Lighthouse Accessibility score in Desktop mode across all views
- Lighthouse Audit Tools
- Verified by running Google Chrome DevTools **Lighthouse Audit** in Desktop mode 
- All views achieved a 100% Accessibility score. 

10. Unit tests written for at least one non-trivial function
- Unit tests in `script.test.js` 
- Executed via Jest (`npm test`) 
- The test passed.

11. No dead code (All JS and CSS must be used)
- Manual code check with Visual Studio code 
- Used "Find references" and checked that they were used
- Confirmed 100% of functions are actively utilized. 

12. Non-existent user search shows descriptive error message
- Tested manually by searching for invalid usernames (e.g., `bbb`) 
- Error message should be displayed 
- User "bbb" was not found on Codewars.

13. API fetch errors display useful error messages
- Tested offline conditions. 
- Error message should be displayed
- Verified that API failures display error messages. 

14. Error messages do not make misleading claims and guide user remediation
- Manual checking the source code
- Reviewed all user-facing error strings
- Confirmed that technical accuracy and clear guidance was made.


