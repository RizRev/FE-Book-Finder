pipeline {
    agent any

    stages {
        stage('Run') {
            steps {
                sh 'npm install'
                sh 'npm run dev'
            }
        }
    }
}