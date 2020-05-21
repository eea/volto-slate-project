#!/bin/sh


docker_id=$(cat /proc/self/cgroup | grep :memory: | sed  's#.*/\([0-9a-fA-F]*\)$#\1#' )

if [ -e $docker_id ] && [ $(echo $docker_id | grep -c memory ) -gt 0 ]; then
	REPORTDIR=$(docker inspect $docker_id | grep :/var/jenkins_home/worker | awk -F'["|:]' '{print $2}')
        pwd | sed -e "s#/var/jenkins_home/worker#$REPORTDIR#"
else	
	pwd
fi


