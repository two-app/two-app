FROM adoptopenjdk/openjdk11:latest

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
  nodejs \
  yarn \
  ruby-full \
  ruby-dev \
  unzip \
  ubuntu-dev-tools \
  && rm -rf /var/lib/apt/lists/*

# Install Gradle
RUN curl -L --output gradle-4.0.1-bin.zip  https://services.gradle.org/distributions/gradle-4.0.1-bin.zip \
    && unzip gradle-4.0.1-bin.zip -d /opt \
    && rm gradle-4.0.1-bin.zip

# Install Publish Dependencies
# RUN sudo npm cache clean --force 
RUN npm install -g firebase-tools
RUN gem install bundler