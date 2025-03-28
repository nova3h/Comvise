cp -f proxy.conf /etc/nginx/conf.d/local.comvise.github.io.conf
sudo nginx -t
sudo service nginx restart
# EOF