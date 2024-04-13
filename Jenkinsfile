pipeline {
    agent any

    stages {
        stage('Pull changes') {
            steps {
                // Pull the latest changes from the repository
                dir('/home/book-library/FE-Book-Finder') {
                    sh 'git pull origin main'
                }
            }
        }
        stage('Run') {
            steps {
                // Install dependencies and run your application
                dir('/home/book-library/FE-Book-Finder') {
                    sh 'npm install'
                    sh 'npm run dev'
                }
            }
        }
    }
}