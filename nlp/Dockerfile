FROM python:2.7-onbuild
EXPOSE 5001
CMD ["/usr/local/bin/gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "-k", "gevent", "clips:app"]