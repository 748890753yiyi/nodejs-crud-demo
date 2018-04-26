struct Group{
	1:string class_id,
	2:string name,
	3:string age,
}

service GroupManager{
	string add(1:Group group),	
	string update(1:Group group,2:string class_id),
}