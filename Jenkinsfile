pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mSadik07/EasyStock.git'
            }
        }

        stage('Deploy Web App') {
            steps {
                echo 'Web uygulamasi baslatiliyor...'
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }

        stage('Deploy Mobile App') {
            steps {
                echo 'Mobil backend ve frontend baslatiliyor...'
                sh 'docker compose -f docker-compose.mobile.yml down'
                sh 'docker compose -f docker-compose.mobile.yml up -d --build'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sleep 15
                    echo 'Web uygulamasi kontrol ediliyor (Port 3000)...'
                    sh 'curl -f http://localhost:3000 || echo "Web uygulamasi hazir degil"'
                    echo 'Mobil backend kontrol ediliyor (Port 5000)...'
                    sh 'curl -f http://localhost:5000 || echo "Mobil backend hazir degil"'
                }
            }
        }
    }

    post {
        success {
            echo 'EasyStock (Web ve Mobil) deploy basarili!'
        }
        failure {
            echo 'Deploy basarisiz: loglari kontrol et.'
        }
    }
}