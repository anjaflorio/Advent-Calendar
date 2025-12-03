# Advent Calendar

This project is an interactive Advent Calendar designed to surprise and delight your loved one with daily content leading up to a special occasion. Each day reveals a new piece of translated songs, essays, poetry, or personal thoughts.

## Project Structure

The project is organized as follows:

```
advent-calendar
├── src
│   ├── index.html          # Main HTML file for the calendar
│   ├── door-template.html  # Template for each door's content
│   ├── css
│   │   └── styles.css      # Styles for the calendar
│   ├── js
│   │   ├── app.js          # Main JavaScript logic
│   │   └── calendar.js     # Calendar-specific functions
│   ├── data
│   │   └── doors.json      # Metadata for each door
│   ├── content
│   │   └── days            # Daily content files (01.md to 24.md)
│   └── translations        # Translated content for different languages
│       ├── en             # English translations
│       └── [other-language] # Translations in another language
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Getting Started

To get started with the Advent Calendar project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd advent-calendar
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Run the project**:
   You can use a local server to view the calendar. For example, you can use `live-server` or any other local server of your choice.

4. **Open the calendar**:
   Navigate to `src/index.html` in your browser to view the Advent Calendar.

## Customization

Feel free to customize the content behind each door by editing the markdown files located in `src/content/days`. You can also add translations in the `src/translations` directory.

## Contributing

If you would like to contribute to this project, please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.