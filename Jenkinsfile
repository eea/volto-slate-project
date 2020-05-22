pipeline {
  
  stages{ 
   stage("Test Code and Integration") {
    parallel {
       stage("Code") {
          agent {
            label "eea"
          }
          environment {
            GIT_NAME = "volto-slate-project"
            SONARQUBE_TAGS = "www.eionet.europa.eu,forest.eea.europa.eu"
            PATH = "${tool 'NodeJS12'}/bin:${tool 'SonarQubeScanner'}/bin:$PATH"
          }
          stages {              
               stage("Installation for Testing") {
                   steps {
                       script{
                         checkout scm
                         tool 'NodeJS12'
                         tool 'SonarQubeScanner'
                         sh "yarn install"  
                       }
                   }
               }
               stage("Code Quality") {
                   steps {
                         catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                           sh "yarn run prettier"
                         }
                         catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                           sh "yarn run lint"
                         }
                         catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                           sh "yarn run code-analysis:i18n"
                         }
                   }
               }
               stage("Unit tests") {
                   steps {
                            sh '''hostname'''
                            sh '''yarn test-addon --watchAll=false --collectCoverage'''
                         }                      
               }
               stage("Sonarqube") {
                   steps {
                       withSonarQubeEnv('Sonarqube') {
                               sh '''sonar-scanner -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info -Dsonar.sources=./src -Dsonar.projectKey=$GIT_NAME-$BRANCH_NAME -Dsonar.projectVersion=$BRANCH_NAME-$BUILD_NUMBER'''
                               sh '''try=2; while [ \$try -gt 0 ]; do curl -s -XPOST -u "${SONAR_AUTH_TOKEN}:" "${SONAR_HOST_URL}api/project_tags/set?project=${GIT_NAME}-${BRANCH_NAME}&tags=${SONARQUBE_TAGS},${BRANCH_NAME}" > set_tags_result; if [ \$(grep -ic error set_tags_result ) -eq 0 ]; then try=0; else cat set_tags_result; echo "... Will retry"; sleep 60; try=\$(( \$try - 1 )); fi; done'''
                            
                       }
                   }
               }
          }
         post {
           always { 
             sh '''yarn cache clean'''
             cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, deleteDirs: true)
           }
         }
       } 
       stage("Integration") {
         agent {
              label "docker-host"
         }
         environment {
            PATH = "${tool 'NodeJS12'}/bin:$PATH"
          }
         stages {
            stage('Integration Tests') {
              steps {
                script{
                  checkout scm
                  String port1 = sh(script: 'echo $(python -c \'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()\');', returnStdout: true);
                  String port2 = sh(script: 'echo $(python -c \'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()\');', returnStdout: true);
                  def nodeJS = tool 'NodeJS12';
                  sh "hostname"
                  sh "yarn install"
                  try {
                    sh "yarn ci:cypress:run"
                  } finally {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                      sh "yarn ci:cypress:end"
                    }       
                  }
                 
                }
              }
            } 
         }
         post {
           always {
              sh '''yarn cache clean'''
              catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    archiveArtifacts artifacts: 'cypress/videos/*.mp4', fingerprint: true
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*.*', fingerprint: true
              }  
              cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, deleteDirs: true)
           }
         }
       }               
    }                
   }
  }
  post {
    changed {
      script {
        
        def url = "${env.BUILD_URL}/display/redirect"
        def status = currentBuild.currentResult
        def subject = "${status}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
        def summary = "${subject} (${url})"
        def details = """<h1>${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${status}</h1>
                         <p>Check console output at <a href="${url}">${env.JOB_BASE_NAME} - #${env.BUILD_NUMBER}</a></p>
                      """

        def color = '#FFFF00'
        if (status == 'SUCCESS') {
          color = '#00FF00'
        } else if (status == 'FAILURE') {
          color = '#FF0000'
        }

        emailext (subject: '$DEFAULT_SUBJECT', to: '$DEFAULT_RECIPIENTS', body: details)
      }
    }
  }
}
