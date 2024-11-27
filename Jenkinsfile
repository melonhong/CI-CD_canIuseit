pipeline {
    agent any

    environment {
	MY_ENV_FILE = credentials('MY_ENV_FILE')
        NETWORK_NAME = 'mynetwork'
        DB_CONTAINER_NAME = 'db_container'
        WEB_CONTAINER_NAME = 'web_container'
        WEB_IMAGE_NAME = '20221174/ci-cd:1.1'
	JENKINS_SERVER_ADDR = '34.83.123.95'
    }

    stages {
	stage('Extract Env Variables') {
            steps {
                script {
                    // Secret File을 다운로드하고, 환경 변수로 로드
                    sh "cp ${MY_ENV_FILE} .env"  // Secret File을 작업 디렉터리에 복사
                    sh "cat .env"  // .env 파일 내용 출력 (테스트용)

                    // .env 파일을 source 명령으로 불러오기
                    sh "source .env && echo 'Environment variables loaded'"
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
		    docker logs $WEB_CONTAINER_NAME
		    echo "Waiting for DB to initialize..."
            	    sleep 20	
		    echo "Sending request to the server..."
                    RESPONSE=$(curl --max-time 10 -s -w "%{http_code}" -o /dev/null http://localhost:3000)
                    if [ "$RESPONSE" -eq 200 ]; then
                        echo "Server is running properly. HTTP Status: $RESPONSE"
                    else
                        echo "Test failed! HTTP Status: $RESPONSE"
                    fi
                    '''
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
