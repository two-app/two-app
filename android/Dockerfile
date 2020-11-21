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
  brotli \
  bzip2 \
  dbus \
  dnsutils \
  dpkg \
  fakeroot \
  file \
  flex \
  ftp \
  gnupg2 \
  iproute2 \
  iputils-ping \
  jq \
  lib32z1 \
  libc++-dev \
  libc++abi-dev \
  libcurl4 \
  libgbm-dev \
  libgconf-2-4 \
  libgtk-3-0 \
  libsecret-1-dev \
  libsqlite3-dev \
  libunwind8 \
  libxkbfile-dev \
  libxss1 \
  locales \
  m4 \
  netcat \
  openssh-client \
  parallel \
  patchelf \
  pkg-config \
  python-is-python3 \
  rpm \
  rsync \
  shellcheck \
  sqlite3 \
  ssh \
  sudo \
  telnet \
  texinfo \
  time \
  tk \
  tzdata \
  unzip \
  upx \
  wget \
  xorriso \
  xvfb \
  xz-utils \
  zip \
  zstd \
  zsync \
  && rm -rf /var/lib/apt/lists/*

# Install Gradle
RUN curl -L --output gradle-4.0.1-bin.zip  https://services.gradle.org/distributions/gradle-4.0.1-bin.zip \
    && unzip gradle-4.0.1-bin.zip -d /opt \
    && rm gradle-4.0.1-bin.zip

# Install Publish Dependencies
RUN npm install -g firebase-tools
RUN gem install bundler
RUN sudo gem install fastlane -NV