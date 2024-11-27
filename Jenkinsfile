pipeline {
    agent any

    environment {
        NETWORK_NAME = 'mynetwork'
        DB_CONTAINER_NAME = 'db_container'
        WEB_CONTAINER_NAME = 'web_container'
        WEB_IMAGE_NAME = 'myapp'
    }

    stages {
        stage('Create docker network') {
            steps {
                sh 'docker network create $NETWORK_NAME | true'
            }
        }

        stage('Run DB Container') {
            steps {
                script {
                    // 데이터베이스 컨테이너 실행
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
                    // 웹 컨테이너 빌드
                    sh 'docker build -t $WEB_IMAGE_NAME .'
                }
            }
        }

        stage('Run Web Container') {
            steps {
                script {
                    // 웹 컨테이너 실행 (DB와 연결)
                    sh "docker run -d --name $WEB_CONTAINER_NAME --network $NETWORK_NAME -p 3000:3000 $WEB_IMAGE_NAME"
                }
            }
        }

        stage('Test') {
            steps {
                script {
			// 서버에 요청을 보내고 HTTP 상태 코드를 확인
            		sh '''
			docker ps
            		echo "Sending request to the server..."
            		RESPONSE=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:3000)
            		if [ "$RESPONSE" -eq 200 ]; then
                		echo "Server is running properly. HTTP Status: $RESPONSE"
            		else
                		echo "Test failed! HTTP Status: $RESPONSE"
            		fi
            		'''
                }
            }
        }

        stage('Clean up') {
            steps {
                script {
                    // 컨테이너 종료 및 이미지 삭제 (선택사항)
                    sh "docker stop $WEB_CONTAINER_NAME $DB_CONTAINER_NAME"
                    sh "docker rm $WEB_CONTAINER_NAME $DB_CONTAINER_NAME"
                    sh "docker rmi $WEB_IMAGE_NAME"
                }
            }
        }
    }
}

