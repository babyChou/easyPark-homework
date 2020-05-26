# FTP

		$ service vsftpd start
		$ service vsftpd restart
		$ service vsftpd status

user: root
password: toor
port:21

ftp://10.101.0.192

[REF](https://www.hiroom2.com/2017/08/06/kalilinux-2017-1-vsftpd-en/)

# Nodejs Server

		$ cd /root/project/
		$ npm start

Open Browser type `10.101.0.192:3000`


# mysql server

		启动mysql：
		方式一：sudo /etc/init.d/mysql start 
		方式二：sudo start mysql
		方式三：sudo service mysql start

		停止mysql：
		方式一：sudo /etc/init.d/mysql stop 
		方式二：sudo stop mysql
		方式san：sudo service mysql stop

		重启mysql：
		方式一：sudo/etc/init.d/mysql restart
		方式二：sudo restart mysql
		方式三：sudo service mysql restart