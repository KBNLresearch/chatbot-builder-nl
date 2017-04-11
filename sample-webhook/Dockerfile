FROM node:6.10.1-onbuild

EXPOSE 5002

ENV TZ=Europe/Amsterdam
RUN echo $TZ | tee /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata