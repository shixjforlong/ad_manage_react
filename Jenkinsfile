pipeline {
    agent none
    environment {
        version = 'v1.1.0'
    }

    options {
        disableConcurrentBuilds()
        skipDefaultCheckout()
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                script {
                    checkout scm
                    currentBuild.displayName = displayName()
                }
                slackSendStart()
            }
        }

        stage('Build') {
            agent any
            steps {
                ansiColor('xterm') {
                    nodejs('node:6') {
                        sh "rm -rf dist yarn.lock"
                        sh "yarn install --ignore-optional"
                        sh "yarn build"
                    }
                }

                stash includes: 'dist/**', name: 'dist'
            }


        }

        stage('Deploy') {
            when {
                branch 'develop'
            }
            agent {
                node {
                    label 'shebeiyun'
                    customWorkspace '/mnt/elements/html'
                }
            }
            steps {
                unstash 'dist'
                sh 'cp -r dist/. ds_react/ && rm -rf dist'
            }
        }

        stage('jira') {
            agent any
            when {
                branch 'develop'
            }
            steps{
                step([$class       : 'hudson.plugins.jira.JiraIssueUpdater',
                      issueSelector: [$class: 'hudson.plugins.jira.selector.DefaultIssueSelector'],
                      scm          : scm])
            }
        }
    }


    post {
        always {
            echo 'build done'
            // send build result status to slack channel
            slackMessage()
        }
    }
}
