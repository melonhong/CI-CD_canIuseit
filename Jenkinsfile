pipeline {
    agent any

    environment {
        // Secret File을 가져오는 부분
        MY_ENV_FILE = credentials('MY_ENV_FILE')  // .env 파일의 Jenkins credentials ID
        NETWORK_NAME = 'mynetwork'
        DB_CONTAINER_NAME = 'db_container'
        WEB_CONTAINER_NAME = 'web_container'
        WEB_IMAGE_NAME = '20221174/ci-cd:1.1'
        PROJECT_ID = 'open-source-software-435607'
	CLUSTER_NAME = 'cluster'
	LOCATION = 'us-central1-c'
	CREDENTIALS_ID ='mygke'
    }

    stages {
        stage('Extract Env Variables') {
            steps {
                script {
                    // .env 파일 권한 확인 후, 읽기/쓰기 권한 추가
                    //sh 'chmod 644 .env'

                    // 작업 디렉토리에 쓰기 권한 부여
                    //sh 'chmod 777 .'

                    // .env 파일을 작업 디렉토리에 복사
		    sh "cat ${MY_ENV_FILE} > .env"

                }
            }
        }
        stage('Create docker network') {
            steps {
                sh 'docker network create $NETWORK_NAME || true'
            }
        }

        stage('Run DB Container') {
            steps {
                script {
                    sh '''
                    docker run -d --name $DB_CONTAINER_NAME \
                    --network $NETWORK_NAME \
                    -e MYSQL_ROOT_PASSWORD=cancanii! \
                    -e MYSQL_DATABASE=canIuseit_db \
                    -p 3306:3306 mysql:8
                    '''
                }
            }
        }

        stage('Build Web Container') {
            steps {
                script {
                    sh 'docker build -t $WEB_IMAGE_NAME .'
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
                    echo "Checking container is available..."
                    docker ps
                    echo "Waiting for DB to initialize..."
                    sleep 20	
                    echo "Sending request to the server..."
		    docker logs $WEB_CONTAINER_NAME
		    RESPONSE=$(docker exec web_container curl --max-time 10 -s -w "%{http_code}" -o /dev/null http://localhost:3000)
		    if [ "$RESPONSE" -eq 200 ]; then
		    	echo "Server is running properly. HTTP Status: $RESPONSE"
		    else
    			echo "Test failed! HTTP Status: $RESPONSE"
		    fi
                    '''
                }
            }
        }

	stage('Deploy to GKE') {
		steps {
			script {
				// Docker 이미지 빌드 후, GKE에 배포할 때 이미지 태그를 빌드 ID로 변경
                    		//sh "sed -i 's/cicd:latest/cicd:${env.BUILD_ID}/g' deployment.yaml"

                    		// Kubernetes Engine으로 배포
				step([$class: 'KubernetesEngineBuilder', 
				      projectId: env.PROJECT_ID, 
				      clusterName: env.CLUSTER_NAME,
				      location: env.LOCATION, 
				      manifestPattern: 'deployment.yaml', 
				      credentialsId: env.CREDENTIALS_ID,
				      verifyDeployments: true])

				// 배포된 파드가 실행되도록 잠시 기다리기 (5초~10초 대기)
			        echo "Waiting for the pods to be ready..."
			        sleep time: 30, unit: 'SECONDS'  // 파드가 준비되는 데 약간의 시간이 필요
			
			        // 파드를 5분 동안 실행하고 삭제
			        echo "Pods will run for 5 minutes..."
			        sleep time: 5, unit: 'MINUTES'  // 5분 대기
			
			        // 5분 후 파드 삭제
			        echo "Deleting the pods after 5 minutes..."
			        sh 'kubectl delete pods --selector=app=hello'  // `app=hello` 라벨을 가진 파드 삭제
			}
		}
	}
    }

    post {
        always {
            echo 'Cleaning up Docker resources...'
            sh '''
            docker stop $WEB_CONTAINER_NAME $DB_CONTAINER_NAME || true
            docker rm $WEB_CONTAINER_NAME $DB_CONTAINER_NAME || true
            docker rmi $WEB_IMAGE_NAME || true
            docker network rm $NETWORK_NAME || true
            '''
        }
    }
}

