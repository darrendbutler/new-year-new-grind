# New Year New Grind

## Inspiration
We wish to encourage everyone to achieve their new year resolution. With the New Year rolling in, many of us have resolutions. Unfortunately, only 8% of people who make a New Year’s resolution keep it, and 80% fall behind by February. What if we had a social incentive to keep our resolutions?

## What it does
New Year, New Grind is a web application with integrated hardware that allows users to share and track their New Year’s Resolution progress with others across the globe. It shares every user's new year resolutions and their progress. See New Year's Resolutions from around the world!

The Motivation Device (integrated hardware) gives users an additional boost. Every day the user can push a physical button to light an LED and indicate they did something towards their resolution. This device is synced with the web application and updates the user's progress. Plus, pressing buttons is fun!


## How we built it
**Frontend:** HTML, CSS, Javascript 
**Database:** Firebase
**Backend:** Javascript
**APIs:** Radar.io, Google Maps

We used HTML, CSS, and Javascript to make an innovative and easy-to-access UI/UX experience. We then used Google Cloud's Firebase to allow user authentication with email, utilizing their Authentication UI. Also, using Cloud Firestore in  Firebase, we were able to store basic user information and resolutions and create the customer experience. The user's country and flag are obtained and displayed using Radar.io's geocoding API.

We used a Raspberry PI to create our Motivation Device and synced it with our Realtime Database in Firebase. The circuit was made using the Raspberry Pi, four push buttons, four red LEDs, and four 220Ω resistors. Unfortunately due to the limited materials and the pandemic, we were only able have the LED symbolize four of the seven days of the week.

## Challenges we ran into
It was our first time using Firebase so we had to learn to navigate it quickly. We had some difficulty in using certain tools when came comes to presenting a map for a user's location. We tried using Google Map and Radar.io APIs to create an interactive map but those attempts failed. Ultimately, we found an alternative where we simply allow the user to input their own location through an embedded Google Map. 

Integrating the Raspberry PI also proved to be a challenge. The Motivation Device would need to read and write to the data on Firebase,and based on which button the user is going to press and how it should be reflected on Firebase. Through many hours of trial and error we were able to successfully implement the feature though the help of the Firebase Documents 

## Accomplishments that we're proud of
We were proud of the fact that many of the features we planned were added to our web app including the progress bar, user's personal new year resolution section, and a map that indicates all the user's resolutions around the globe. For some, it was their first time, building a fully functioning web app.

## What we learned
We learned how to use Firebase for user authentication, creating, reading, and updating data including the current user, message, and progress. We also learned some new things in HTML, CSS, and Javascript like Flexbox and how to parse JSON data.

## What's next for NYNG (New Year New Grind)
We hope to add more features including a way to add a user's favorite new year resolution from other users.
1. Users will be able to save their favorite new year's resolutions from other people.
2. Users will see other users' countries and flags in the Global Resolutions section.
3. Updates from the Motivation Device will be shown on the website
4. UI will be more responsive fore mobile users
5. The Motivation Device will feature all seven days of the week instead of four

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/new-year-new-grind)
