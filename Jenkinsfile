pipeline {

  agent any

  environment {
    ALLURE = '2.29.0'
    TOKEN = 'glpat-64VubsDGWUwgPgYkgEjs'
  }

  parameters {
    choice(
      name: 'Browser',
      choices: ['Firefox', 'Chrome', 'Chromium', 'Edge'],
      description: 'The browser to test'
    )
  }

  stages {

    stage('Test') {
      agent {
        docker { 
          image 'harmin/qa-runner-debian'
          
        }
      }
      steps {
        sh '''
          export PATH=$PATH:/tmp/venv/bin
          python3 -m venv /tmp/venv
          . /tmp/venv/bin/activate
          cd tests-python
          export PYTHONPATH=$(pwd)
          pip install -r requirements.txt
          which behave
          find / -name behave
        '''
        stash includes: 'reporting/**', name: 'artifact_test'
      }
    }

    stage('Report') {
      agent {
        docker { image 'openjdk:8-jre' }
      }
      steps {
        unstash 'artifact_test'
        sh '''
          exit
          curl https://github.com/allure-framework/allure2/releases/download/${ALLURE}/allure-${ALLURE}.zip -L -o /tmp/allure.zip
          unzip /tmp/allure.zip -d /tmp/
          mv /tmp/allure-${ALLURE} /tmp/allure
          #./allure.sh --browser $Browser
        '''
        stash includes: 'reporting/**', name: 'artifact_report'
      }
      post {
        always {
          archiveArtifacts artifacts: 'reporting/**'
        }
      }
    }

    stage('Commit') {
      steps {
        unstash 'artifact_report'
        sh ''' 
          exit
          rm -rf reports
          git config --global user.name "Gitlab CI"
          git config --global user.email "gitlab@mg.gitlab.com"
          git clone https://gitlab-ci-token:${TOKEN}@gitlab.com/harmin-qa/reports.git
          mv reporting/allure-reports/* reporting/
          rm -rf reporting/allure-reports reporting/allure-results
          cp -r reporting/* reports/
          cd reports
          git add *
          git commit -m "Gitlab-CI commit"
          git push
        '''
      }
    }
  }

}