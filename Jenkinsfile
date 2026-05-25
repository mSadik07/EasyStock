pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mSadik07/EasyStock.git'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sleep 15
                    sh 'curl -f http://localhost:3000 || echo "Backend henuz hazir degil"'
                }
            }
        }
    }

    post {
        success {
            echo 'EasyStock deploy basarili!'
        }
        failure {
            echo 'Deploy basarisiz: loglari kontrol et.'
        }
    }
}