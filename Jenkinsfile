pipeline {
    agent none

    parameters {
        choice(name: 'BROWSER', choices: ['firefox', 'chrome', 'chromium', 'msedge'], description: 'The browser to run the tests.')
        choice(name: 'DOCKER', choices: ['harmin/qa-runner-debian', 'harmin/qa-runner-ubuntu'], description: 'The docker image to run the tests.')
    }

    environment {
        ALLURE = '2.35.1'
        EXECUTOR_NAME = 'Jenkins'
        EXECUTOR_TYPE = 'jenkins'
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                sh 'git config --global --add safe.directory "$PWD"'
                deleteDir()
                git branch: 'main', url: 'https://github.com/harmin-parra/tests.git'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image "${params.DOCKER}"
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -eux

                    # Workspace-local Gradle cache
                    export GRADLE_USER_HOME=$PWD/.gradle
                    mkdir -p "$GRADLE_USER_HOME"
                    find "$GRADLE_USER_HOME" -name "*.lck" -delete

                    # Activate Python venv
                    export PATH="$PATH:$HOME/.local/bin"
                    python3 -m venv "$HOME/venv"
                    . "$HOME/venv/bin/activate"

                    # Run tests
                    set +e
                    ./runner.sh --browser "${BROWSER}"
                    RUNNER_EXIT=$?
                    set -e

                    # Prepare reporting folders
                    mkdir -p reporting/allure-results/java reporting/allure-results/nodejs reporting/allure-results/python
                    echo "$BUILD_URL" > reporting/allure-results/java/job.url
                    echo "$BUILD_URL" > reporting/allure-results/nodejs/job.url
                    echo "$BUILD_URL" > reporting/allure-results/python/job.url

                    # Fail the stage if runner.sh failed
                    if [ $RUNNER_EXIT -ne 0 ]; then
                        echo "Runner script failed with exit code $RUNNER_EXIT"
                        exit $RUNNER_EXIT
                    fi
                '''
            }
            post {
                always {
                    stash name: 'reporting', includes: 'reporting/**'
                    archiveArtifacts artifacts: 'reporting/**', allowEmptyArchive: true
                }
            }
        }

        stage('Report') {
            agent {
                docker {
                    image 'eclipse-temurin:8-jre'
                    reuseNode true
                }
            }
            steps {
                unstash 'reporting'
                sh '''
                    set -eux
                    apt-get update && apt-get install -y unzip curl
                    curl -L "https://github.com/allure-framework/allure2/releases/download/${ALLURE}/allure-${ALLURE}.zip" -o /tmp/allure.zip
                    unzip -q /tmp/allure.zip -d /usr/local/
                    ln -sf "/usr/local/allure-${ALLURE}/bin/allure" /usr/local/bin/allure
                    ./allure.sh --browser "${BROWSER}"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'reporting/**', allowEmptyArchive: true
                }
            }
        }

        stage('Commit') {
            agent {
                docker {
                    image 'bitnami/git:latest'
                    reuseNode true
                }
            }
            environment {
                GIT_AUTHOR_NAME  = 'Jenkins'
                GIT_AUTHOR_EMAIL = 'jenkins@jenkins.io'
            }
            steps {
                unstash 'reporting'
                withCredentials([string(credentialsId: 'gitlab-reports-token', variable: 'TOKEN')]) {
                    sh '''
                        set -eux
                        git config --global user.name "$GIT_AUTHOR_NAME"
                        git config --global user.email "$GIT_AUTHOR_EMAIL"

                        rm -rf reports
                        git clone "https://gitlab-ci-token:${TOKEN}@gitlab.com/harmin-demo/reports.git"
                        cd reports

                        git rm -r report-* || true
                        mv ../reporting/report-* ./ || true
                        mkdir -p ./allure-reports
                        mv ../reporting/allure-reports/report-* ./ || true

                        git add -A
                        git commit -m "Jenkins commit" || echo "Nothing to commit"
                        git push origin HEAD
                    '''
                }
            }
        }

        stage('Cleanup') {
            agent any
            steps {
                cleanWs(deleteDirs: true, notFailBuild: true)
            }
        }
    }
}
