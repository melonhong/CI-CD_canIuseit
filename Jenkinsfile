node {
    def app
    stage('Clone repository') {
        git branch: 'main', url: 'https://github.com/20221174/CI-CD_canIuseit'
    }
    stage('Build image') {
        app = docker.build("20221174/CI-CD")
    }
    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', '20221174') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
}

