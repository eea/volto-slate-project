pipeline {
  agent none
  stages{ 
   stage("Test Code and Integration") {
    parallel {
       stage("Code") {
          agent {
            node { label "eea" }
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
                            sh '''yarn test-addon --watchAll=false --collectCoverage --coverageReporters lcov cobertura text | tee -a unit_tests_log.txt'''
                            publishHTML (target : [allowMissing: false,
                             alwaysLinkToLastBuild: true,
                             keepAll: true,
                             reportDir: 'coverage/lcov-report',
                             reportFiles: 'index.html',
                             reportName: 'Coverage',
                             reportTitles: 'Code Coverage'])
                         }
                         post {
                           failure {
                              catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                                    archiveArtifacts artifacts: 'unit_tests_log.txt', fingerprint: true
                              }  
                           }
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
           node { label "docker-host" }
         }
         environment {
            PATH = "${tool 'NodeJS12'}/bin:$PATH"
            port1 = sh(script: 'echo $(python3 -c \'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1], end = ""); s.close()\');', returnStdout: true).trim();
            port2 = sh(script: 'echo $(python3 -c \'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1], end = ""); s.close()\');', returnStdout: true).trim();
          }
         stages {
            stage('Integration Tests') {
              steps {
                script{
                  checkout scm
                  
                  def nodeJS = tool 'NodeJS12';
                  sh "hostname"
                  sh "env"
                  // make sure docker will have the exposed ports available and the docker names are unique
                  sh '''sed -i "s/8080:8080/$port1:8080/" package.json; sed -i "s/localhost:8080/localhost:$port1/" package.json'''
                  sh '''sed -i "s/3000:3000/$port2:3000/" package.json; sed -i "s/localhost:3000/localhost:$port2/" package.json'''
                  sh '''sed -i "s/--name plone/--name backend_$port1/" package.json; sed -i "s/--link plone:plone/--link backend_$port1:plone/g" package.json'''
                  sh '''sed -i "s/--name webapp/--name frontend_$port2/" package.json; sed -i "s/--link webapp:webapp/--link frontend_$port2:webapp/g" package.json'''
                  sh '''sed -i "s/docker stop webapp plone/docker stop frontend_$port2 backend_$port1/" package.json'''
                  sh '''cat package.json'''
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
           failure {
              catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*.*', fingerprint: true
                    archiveArtifacts artifacts: 'cypress/videos/*.mp4', fingerprint: true 
              }  
           }
           always {
              sh '''yarn cache clean'''
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
