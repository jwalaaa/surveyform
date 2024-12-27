// pages/survey.js
"use client";
import { useEffect } from "react";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import "survey-core/defaultV2.min.css";

export default function SurveyPage({ apiKey, apiUrl }) {
  const surveyJSON = {
    title: "Survey Form",
    pages: [
      {
        name: "personalInfo",
        title: "Personal Information",
        elements: [
          {
            type: "text",
            name: "firstName",
            title: "First Name",
            isRequired: true,
          },
          {
            type: "text",
            name: "lastName",
            title: "Last Name",
            isRequired: true,
          },
          {
            type: "text",
            name: "Email",
            title: "Email",
            isRequired: true,
            validators: [
              {
                type: "email",
              },
            ],
          },
          {
            type: "text",
            name: "phone",
            title: "Phone Number",
            inputType: "tel",
            validators: [
              {
                type: "regex",
                regex: "\\d{10}",
                text: "Please enter a valid 10-digit phone number",
              },
            ],
          },
        ],
      },
      {
        name: "preferences",
        title: "Preferences",
        elements: [
          {
            type: "radiogroup",
            name: "ownsCar",
            title: "Do you own a car?",
            choices: ["Yes", "No"],
            isRequired: true,
          },
          {
            type: "dropdown",
            name: "carBrand",
            title: "What car brand do you own?",
            visibleIf: "{ownsCar} = 'Yes'",
            choices: [
              "Toyota",
              "BMW",
              "Honda",
              "Mercedes",
              "Ford",
              "Volkswagen",
            ],
          },
          {
            type: "number",
            name: "monthlyKilometers",
            title: "How many kilometers do you drive per month?",
            visibleIf: "{ownsCar} = 'Yes'",
          },
          {
            type: "radiogroup",
            name: "travelsForWork",
            title: "Do you travel frequently for work?",
            choices: ["Yes", "No"],
            isRequired: true,
          },
          {
            type: "checkbox",
            name: "transportModes",
            title: "Which mode of transportation do you prefer?",
            visibleIf: "{travelsForWork} = 'Yes'",
            choices: ["Flight", "Train", "Car", "Bus"],
          },
        ],
      },
      {
        name: "feedback",
        title: "Feedback",
        elements: [
          {
            type: "matrix",
            name: "satisfactionMatrix",
            title: "Please rate the following statements",
            columns: [
              { value: 1, text: "1" },
              { value: 2, text: "2" },
              { value: 3, text: "3" },
              { value: 4, text: "4" },
              { value: 5, text: "5" },
            ],
            rows: [
              { value: "easy", text: "The survey was easy to understand" },
              { value: "intuitive", text: "The form interface was intuitive" },
              { value: "relevant", text: "The questions were relevant" },
            ],
          },
          {
            type: "file",
            name: "document",
            title: "Upload a document or image",
            maxSize: 10485760, // 10MB
            acceptedTypes: ".pdf,.png,.jpg,.jpeg",
          },
          {
            type: "comment",
            name: "additionalFeedback",
            title: "Do you have any additional feedback?",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    Survey.StylesManager.applyTheme("modern");
  }, []);

  const onComplete = async (survey) => {
    const surveyData = {
      name: survey.data.firstName || "Default Name",
      ...survey.data, // Add all other survey responses dynamically
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response body as text
        console.error(
          `Survey submission failed with status: ${response.status} and error: ${errorText}`
        );
        throw new Error(
          `Survey submission failed with status: ${response.status} and error: ${errorText}`
        );
      }

      alert("Survey submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Survey.Survey
        json={surveyJSON}
        onComplete={onComplete}
        showCompletedPage={true}
      />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    return {
      props: {
        apiKey: "Z1YQISmLVzLs5iT2Fvq9cjXB4Eql5uAd",
        apiUrl: "https://apim.quickwork.co/mentortrack/survey/v1/survey",
      },
    };
  } catch (error) {
    console.error("Error fetching survey configuration:", error);
    return {
      props: {
        apiKey: "Z1YQISmLVzLs5iT2Fvq9cjXB4Eql5uAd",
        apiUrl: "https://apim.quickwork.co/mentortrack/survey/v1/survey",
        error: "Failed to load survey configuration",
      },
    };
  }
}
