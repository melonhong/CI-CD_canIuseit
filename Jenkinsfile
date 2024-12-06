pipeline {
    agent any

    environment {
        MY_ENV_FILE = credentials('MY_ENV_FILE')
        NETWORK_NAME = 'mynetwork'
        WEB_CONTAINER_NAME = 'web_container'
        WEB_IMAGE_NAME = '20221174/ci-cd'
        PROJECT_ID = 'open-source-software-435607'
        CLUSTER_NAME = 'cluster'
        LOCATION = 'us-central1-c'
        CREDENTIALS_ID = 'mygke'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub') 
    }

    stages {
        stage('Extract Env Variables') {
            steps {
                script {
                    sh "cat ${MY_ENV_FILE} > .env"
                }
            }
        }

        stage('Build Web Container') {
            steps {
                script {
                    myapp = docker.build("${env.WEB_IMAGE_NAME}:${env.BUILD_ID}")
                }
            }
        }

        stage('Run Web Container') {
            steps {
                script {
                    sh "docker run -d --name $WEB_CONTAINER_NAME --network $NETWORK_NAME -p 3000:3000 $WEB_IMAGE_NAME"
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh '''
                        echo "Sending request to the server..."

                        # RESPONSE 변수에 curl을 통해 상태 코드를 저장
                        RESPONSE=$(docker exec $WEB_CONTAINER_NAME curl -s -v -w "%{http_code}" -o response_body.txt http://localhost:3000)
                        
                        # 상태 코드가 200인지 확인
                        if [ "$RESPONSE" = "200" ]; then
                            echo "Server is running properly. HTTP Status: $RESPONSE"
                        else
                            echo "Test failed! HTTP Status: $RESPONSE"
                        fi
                        
                        # 항상 response_body.txt 파일의 내용 출력
                        echo "Response Body:"
                        cat response_body.txt
                        
                        # 컨테이너 로그 출력
                        echo "Logs from the container:"
                        docker logs $WEB_CONTAINER_NAME
                        
                        # 테스트 실패 시 종료
                        if [ "$RESPONSE" != "200" ]; then
                            exit 1
                        fi
                    '''
                }
            }
        }

         stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        myapp.push("latest")
                        myapp.push("${env.BUILD_ID}")
                    }
                }
            }
}

        stage('Deploy to GKE') {
            when {
                expression { env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    sh "sed -i 's#20221174/ci-cd:latest#20221174/ci-cd:${env.BUILD_ID}#g' deployment.yaml"
                    step([$class: 'KubernetesEngineBuilder', 
                          projectId: env.PROJECT_ID, 
                          clusterName: env.CLUSTER_NAME,
                          location: env.LOCATION, 
                          manifestPattern: 'deployment.yaml', 
                          credentialsId: env.CREDENTIALS_ID,
                          verifyDeployments: true])
                }
            }
        }
    }

    post {
    always {
            echo 'Cleaning up Docker resources...'
            sh '''
                docker stop $WEB_CONTAINER_NAME || true
                //docker rm $WEB_CONTAINER_NAME || true
                docker rmi $WEB_IMAGE_NAME:$BUILD_ID
                docker rmi $WEB_IMAGE_NAME:latest
            '''
        }
    }
}
