# JustWhyUs Team Assessment

A Next.js 14 application with MongoDB integration, designed for team assessments.

## Features

- **User Authentication**: Secure login with PIN.
- **Assessment Interface**: Sections for Mindset, Skills, and Values.
- **Admin Dashboard**: Analytics and user progress monitoring.
- **Multi-language Support**: English, French, and Arabic.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop.

## Tech Stack

- **Framework**: Next.js 14
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB URI (Atlas or local)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/goufrout80-star/justwhyus-team-assessment.git
    cd justwhyus-team-assessment
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment:
    Copy `.env.example` to `.env.local` and fill in your credentials:
    ```bash
    cp .env.example .env.local
    ```
    
    Required variables:
    - `MONGODB_URI`: Your MongoDB connection string.
    - `ADMIN_SECRET_KEY`: Secret key for admin tasks.

4.  Run the development server:
    ```bash
    npm run dev
    ```

## deployment

### Netlify

1.  Connect your repository to Netlify.
2.  Set the **Build Command** to `npm run build`.
3.  Set the **Publish Directory** to `.next`.
4.  Add your `MONGODB_URI` and `ADMIN_SECRET_KEY` in Netlify's **Environment Variables**.
5.  Deploy!

## Project Structure

- `/pages/api`: API routes (backend logic).
- `/components`: UI components (React).
- `/models`: MongoDB schemas (Mongoose).
- `/services`: Database service layer.
- `/lib`: Database connection helper.
