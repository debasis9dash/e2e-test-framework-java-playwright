pipeline {
    agent any

    environment {
        BASE_URL     = credentials('restful-booker-base-url')
        API_USERNAME = credentials('restful-booker-username')
        API_PASSWORD = credentials('restful-booker-password')
    }

    triggers {
        // Run on every PR
        githubPullRequests()
        // Nightly at 2 AM
        cron('0 2 * * *')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Running build: ${env.BUILD_NUMBER} on branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Contract Tests - Newman') {
            steps {
                dir('contract-tests') {
                    sh '''
                        npm install
                        npm run test:ci
                    '''
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'contract-tests/results/newman-results.xml'
                }
                failure {
                    echo 'Contract tests failed — stopping pipeline'
                }
            }
        }

        stage('API Tests - REST Assured') {
            steps {
                sh '''
                    ./gradlew :e2e-api-tests:clean :e2e-api-tests:test \
                        -Dbase.url=$BASE_URL \
                        -Dusername=$API_USERNAME \
                        -Dpassword=$API_PASSWORD \
                        --no-daemon
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'e2e-api-tests/build/test-results/**/*.xml'
                    publishHTML(target: [
                        allowMissing         : true,
                        alwaysLinkToLastBuild: true,
                        keepAll              : true,
                        reportDir            : 'e2e-api-tests/build/reports/tests/test',
                        reportFiles          : 'index.html',
                        reportName           : 'REST Assured Test Report'
                    ])
                }
            }
        }

        stage('UI Tests - Playwright') {
            steps {
                dir('e2e-ui-tests') {
                    sh '''
                        npm ci
                        npx playwright install --with-deps chromium
                        npx playwright test --reporter=junit,html
                    '''
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'e2e-ui-tests/test-results/*.xml'
                    publishHTML(target: [
                        allowMissing         : true,
                        alwaysLinkToLastBuild: true,
                        keepAll              : true,
                        reportDir            : 'e2e-ui-tests/playwright-report',
                        reportFiles          : 'index.html',
                        reportName           : 'Playwright Test Report'
                    ])
                }
            }
        }

        stage('Performance Tests - k6') {
            when {
                triggeredBy 'TimerTrigger'
            }
            steps {
                sh '''
                    k6 run \
                        --summary-trend-stats="min,avg,med,p(95),p(99),max" \
                        --out json=performance/results/k6-results.json \
                        performance/booking-journeys.js
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'performance/results/k6-results.json',
                                     allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/results/**/*',
                             allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo "✅ Pipeline passed — Build ${env.BUILD_NUMBER}"
        }
        failure {
            echo "❌ Pipeline failed — Build ${env.BUILD_NUMBER}"
        }
        unstable {
            echo "⚠️ Pipeline unstable — some tests failed"
        }
    }
}