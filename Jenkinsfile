pipeline {
  agent {
    label 'Nodejs -M'
  }
  environment{
    ACCOUNT = ''
    REGION = ''
    APP_NAME = ''
    GIT_REPO = ''
    GIT_CRED = ''
    GIT_BRANCH = ''
    REGISTRY = ""
    IMAGE_TAG = ''
    BASE_URL = ''
    HEALTH_ROUTE = ''
    SONAR_URL = ''
    SONAR_USER = ''
    SONAR_PASS = ''
    TARGETDIR = ""
    DESTDIR = ""
    VERSION = sh(returnStdout: true, script: "grep 'apiVersion'").toString().trim()
    NAMESPACE = sh(returnStdout: true, script: "grep 'nameSpace'").toString().trim()
    APINAME = sh(returnStdout: true, script: "grep 'apiName'").toString().trim()
  }
  tools {
    // To be set in global tool configuration. or agent with nodejs installed?
    nodejs "NodeJs" 
  }
  parameters {
    choice(name: 'RELEASE', choices: ['test', 'production'], description: 'Release to environment')
    choice(name: 'BUMP', choices: ['', 'Major', 'Minor', 'Patch'], description: 'Bump version value')
    booleanParam(name: 'TOGGLE', defaultValue: true, description: 'Toggle value')
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'echo building nestjs app'
        sh 'npm install'
        sh 'npm build'
      }
    }
    stage('Unit test') {
      steps {
        sh 'echo running unit tests'
        sh 'npm run test'
      }
    }
    stage('Tests coverage') {
      steps {
        sh 'echo running tests coverage'
        sh 'npm run test:coverage'
      }
    }
    stage('SAST - Pre run steps') {
      steps {
        sh 'mkdir -p reports'
        sh 'cp -R coverage reports/'
      }
    }
    stage('SAST') {
      environment {
        scannerHome = tool 'SonarQube Scanner'
      }
      steps {
        sh 'echo running SAST tests'
        withSonarQubeEnv ('SonarQube Server') {
          sh '${scannerHome}/bin/sonar-scanner'
          sh 'cat .scannerwork/report-task.txt > reports/sonarqube-report'
        }
        sh 'npm run ci:audit --reportPath=reports/npm-audit-report'
        sh 'nodejsscan --directory `pwd` --output reports/nodejsscan-report'
        sh 'npm run ci:retire --reportPath=reports/npm-retire-report'
        sh '/${JENKINS_HOME}/dependency-check/bin/dependency-check.sh --scan `pwd` --format JSON --out /${JENKINS_HOME}/reports/dependency-check-report --prettyPrint'
        sh 'echo TODO: auditjs'
        sh 'echo TODO: synk'
      }
    }
    stage('SAST - NPM Audit') {
      steps {
        // sh 'echo running npm audit'          
        sh 'npm audit fix || true'
        sh 'npm run ci:audit:report || true'
      }
    }
    stage('Package') {
      when { branch 'master' }
      steps {
        sh 'echo packaging application'
        sh 'docker build -t nest-skeleton .'
        sh 'docker tag nest-skeleton $DOCKER_IMAGE_PATH/nest-skeleton:latest'
      }
    }
    stage('Push Image') {
      when { branch 'master' }
      steps {
        sh 'echo pushing application image to repository'
        sh 'docker login -u "$DOCKER_USERNAME" --password "$DOCKER_PASSWORD" "$DOCKER_REGISTRY"'
      }
    }
    stage('Deploy to test server') {
      when { branch 'master' }
      steps {
        sh 'echo deploying application to test server'
      }
    }
    stage('Functional test') {
      when { branch 'master' }
      steps {
        sh 'echo running functional tests'
        sh 'npm run test:functional:publish'
        // sh 'npm run test:functional:cucumber'
      }
    }
    stage('Performance test') {
      when { branch 'master' }
      steps {
        sh 'echo running performance tests'
        sh 'npm run test:performance'
        // sh 'npm run test:performance:artillery:report-generate'
        // sh 'npm run test:performance:artillery:report-view'
      }
    }
    stage('Tag and release') {
      when { branch 'master' }
      steps {
        sh 'echo tag version for release'
        sh 'echo Package and Push image with new tag'
      }
    }
    stage('Deploy release version to production server') {
      when { branch 'master' }
      steps {
        sh 'echo deploying application to production server'
      }
    }
    stage('Bump next dev version') {
      when { branch 'master' }
      steps {
        sh 'echo bump next development version'
      }
    }
  }
  post {
    always {
      sh 'echo Performing cleanup activities'
      cleanWs(cleanWhenNotBuilt: false,
        deleteDirs: true,
        disableDeferredWipeout: true,
        notFailBuild: true,
        patterns: [
          [pattern: '.gitignore', type: 'INCLUDE'],
          [pattern: '.propsfile', type: 'EXCLUDE']
        ]
      )
      cucumber '**/cucumber-report.json'
      publishHTML (
        target : [
            allowMissing: false,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'reports',
            reportFiles: 'audit.html,artillery.html,coverage/lcov-report/index.html',
            reportName: 'CI Reports',
            reportTitles: 'CI Report'
        ]
      )
    }
  }
}

def getCurrentVersion() {
  def version = sh(returnStdout: true, script: "npm version")
  def versionProps = readJSON text: version
  versionProps[{$APP_NAME}] ? versionProps[{$APP_NAME}] : 'latest'
}