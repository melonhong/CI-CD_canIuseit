pipeline {
    agent any

    environment {
        NETWORK_NAME = 'mynetwork'
        DB_CONTAINER_NAME = 'db_container'
        WEB_CONTAINER_NAME = 'web_container'
        WEB_IMAGE_NAME = 'myapp'
	JENKINS_SERVER_ADDR = 'http://34.83.123.95'
    }

    stages {
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
                    echo "Sending request to the server..."
                    RESPONSE=$(curl -o /dev/null -s -w "%{http_code}" http://$JENKINS_SERVER_ADDR:3000)
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

