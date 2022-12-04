<?php

 
require_once('config/database.php');

class Model_Admin extends Database
{
    public function get_admin_info($username)
    {
        $sql = "
        SELECT DISTINCT idqtv,tentaikhoan FROM quantrivien WHERE tentaikhoan = :username";

        $param = [ ':username' => $username ];

        $this->set_query($sql, $param);
        return $this->load_row();
    }
    public function get_class_info($class_name)
    {
        $sql = "
        SELECT DISTINCT class_id,class_name,name as teacher_name, detail as grade_detail 
        FROM classes
        INNER JOIN grades ON classes.grade_id = grades.grade_id
        INNER JOIN teachers ON classes.teacher_id = teachers.teacher_id
        WHERE class_name = :class_name";

        $param = [ ':class_name' => $class_name ];

        $this->set_query($sql, $param);
        return $this->load_row();
    }
    public function get_list_admins()
    {
        $sql = "SELECT DISTINCT idnhomcauhoi,vanbanbotro,loai,diemtoidanhomcauhoi FROM nhomcauhoi";
        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_list_grades()
    {
        $sql = "SELECT DISTINCT * FROM kythi";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_list_subjects()
    {
        $sql = "SELECT DISTINCT loai FROM nhomcauhoi";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_list_nhomcauhoi()
    {
        $sql = "SELECT DISTINCT loai,vanbanbotro,idnhomcauhoi FROM nhomcauhoi";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function valid_username_or_email($data)
    {
        $sql = "SELECT DISTINCT name FROM students WHERE username = :data  
        UNION
        SELECT DISTINCT name FROM teachers WHERE username = :data 
        UNION
        SELECT DISTINCT name FROM admins WHERE username = :data ";

        $param = [ ':data' => $data ];

        $this->set_query($sql, $param);
        if ($this->load_row() != '') {
            return false;
        } else {
            return true;
        }
    }
    public function valid_class_name($class_name)
    {
        $sql = "SELECT DISTINCT class_id FROM classes WHERE class_name = :class_name";

        $param = [ ':class_name' => $class_name ];

        $this->set_query($sql, $param);

        if ($this->load_row() != '') {
            return false;
        } else {
            return true;
        }
    }

    public function edit_admin($admin_id, $password, $name, $gender_id, $birthday)
    {
        $sql = "SELECT DISTINCT username FROM admins WHERE admin_id = :admin_id";

        $param = [ ':admin_id' => $admin_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()=='') {
            return false;
        }

        $sql="UPDATE admins set password = :password, name = :name, gender_id = :gender_id, 
        birthday = :birthday where admin_id = :admin_id";

        $param = [ ':password' => $password, ':name' => $name, ':gender_id' => $gender_id,
        ':birthday' => $birthday, ':admin_id' => $admin_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
        return true;
    }
    public function del_admin($admin_id)
    {
        $sql="DELETE FROM nhomcauhoi where idnhomcauhoi = :admin_id";
        $param = [ ':admin_id' => $admin_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql = "SELECT DISTINCT idnhomcauhoi FROM nhomcauhoi WHERE idnhomcauhoi = :admin_id";
        $param = [ ':admin_id' => $admin_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()!='') {
            return false;
        }
        return true;
    }
    public function add_admin($vanbanbotro, $diemtoidanhomcauhoi, $loai )
    {
        $sql = "SELECT COUNT(*) as total FROM nhomcauhoi";

        $this->set_query($sql);
        $idnhomcauhoi = 1+ $this->load_row()->total;

        $sql="INSERT INTO nhomcauhoi (idnhomcauhoi, vanbanbotro,loai,diemtoidanhomcauhoi) 
        VALUES (:idnhomcauhoi,:vanbanbotro,:loai, :diemtoidanhomcauhoi)";

        $param = [':idnhomcauhoi'=>$idnhomcauhoi, ':vanbanbotro' => $vanbanbotro, ':diemtoidanhomcauhoi' => $diemtoidanhomcauhoi, ':loai' => $loai ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
        // return true;
    }
    public function get_list_teachers()
    {
        $sql = "SELECT DISTINCT 
        teacher_id,username,avatar,email,name,last_login,birthday,permission_detail,gender_detail 
        FROM teachers
        INNER JOIN permissions ON teachers.permission = permissions.permission
        INNER JOIN genders ON teachers.gender_id = genders.gender_id";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function edit_teacher($teacher_id, $password, $name, $gender_id, $birthday)
    {
        $sql = "SELECT DISTINCT username FROM teachers WHERE teacher_id = :teacher_id";

        $param = [ ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()=='') {
            return false;
        }

        $sql="UPDATE teachers set password = :password, name = :name, 
        gender_id = :gender_id, birthday = :birthday where teacher_id = :teacher_id";

        $param = [ ':password' => $password, ':name' => $name,
        ':gender_id' => $gender_id, ':birthday' => $birthday, ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
        return true;
    }
    public function del_teacher($teacher_id)
    {
        $sql="DELETE FROM teacher_notifications where teacher_id = :teacher_id";
        $param = [ ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="DELETE FROM teachers where teacher_id = :teacher_id";
        $param = [ ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql = "SELECT DISTINCT username FROM teachers WHERE teacher_id = :teacher_id";
        $param = [ ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()!='') {
            return false;
        }
        return true;
    }
    public function add_teacher($name, $username, $password, $email, $birthday, $gender)
    {
        $sql="INSERT INTO teachers (username,password,name,email,birthday,gender_id) 
        VALUES (:username,:password,:name,:email,:birthday,:gender)";

        $param = [ ':username' => $username, ':password' => $password,
        ':name' => $name, ':email' => $email, ':birthday' => $birthday, ':gender' => $gender ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function get_list_students($column_order, $sort_order, $start, $offset)
    {
        $sql = "
        SELECT DISTINCT 
        thisinh.idthisinh,thisinh.tentaikhoan,thisinh.hoten,thisinh.email,thisinh.ngaysinh,thisinh.sodienthoai,kythi.tenkythi
        FROM `thisinh`
        JOIN duthi
  		ON thisinh.idthisinh = duthi.idthisinh
        JOIN kythi
        ON duthi.idkythi=kythi.idkythi;
        ORDER BY $column_order $sort_order LIMIT $start, $offset";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_list_students_search($keyword, $column_order, $sort_order, $start, $offset)
    {
        $sql = "
        SELECT DISTINCT 
        student_id,username,name,email,avatar,birthday,last_login,gender_detail,class_name 
        FROM `students`
        INNER JOIN classes ON students.class_id = classes.class_id
        INNER JOIN genders ON students.gender_id = genders.gender_id
        WHERE students.student_id LIKE '%$keyword%' OR students.username 
        LIKE '%$keyword%' OR students.name LIKE '%$keyword%' OR students.email 
        LIKE '%$keyword%' OR students.birthday LIKE '%$keyword%' OR genders.gender_detail 
        LIKE '%$keyword%' OR classes.class_name LIKE '%$keyword%'
        ORDER BY students.$column_order $sort_order LIMIT $start, $offset";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_total_students_search($keyword)
    {
        $sql = "SELECT DISTINCT count(students.student_id) as total FROM `students`
        INNER JOIN classes ON students.class_id = classes.class_id
        INNER JOIN genders ON students.gender_id = genders.gender_id
        WHERE students.student_id LIKE '%$keyword%' OR students.username 
        LIKE '%$keyword%' OR students.name LIKE '%$keyword%' OR students.email 
        LIKE '%$keyword%' OR students.birthday LIKE '%$keyword%' OR genders.gender_detail 
        LIKE '%$keyword%' OR classes.class_name LIKE '%$keyword%'";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function edit_student($student_id, $birthday, $password, $name, $class_id, $gender)
    {
        $sql="UPDATE students set birthday = :birthday, password = :password, name = :name, 
        class_id = :class_id, gender_id = :gender where student_id = :student_id";

        $param = [ ':student_id' => $student_id, ':birthday' => $birthday,
        ':password' => $password, ':name' => $name, ':class_id' => $class_id, ':gender' => $gender ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="UPDATE scores set class_id = :class_id where student_id = :student_id";

        $param = [ ':class_id' => $class_id, ':student_id' => $student_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
    }
    public function del_student($student_id)
    {
        $sql="DELETE FROM scores where student_id = :student_id";
        $param = [ ':student_id' => $student_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="DELETE FROM students where student_id = :student_id";
        $param = [ ':student_id' => $student_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql = "SELECT DISTINCT username FROM students WHERE student_id = :student_id";
        $param = [ ':student_id' => $student_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()!='') {
            return false;
        }
        return true;
    }
    public function add_student($tentaikhoan, $matkhau, $hoten, $idkythi, $email, $ngaysinh, $sodienthoai)
    {
        $sql = "SELECT DISTINCT COUNT(idthisinh) as total FROM thisinh";

        $this->set_query($sql);
        $idthisinh= $this->load_row()->total + 1;
        $sql="INSERT INTO thisinh (idthisinh, tentaikhoan,matkhau,hoten,email,ngaysinh,sodienthoai) 
        VALUES (:idthisinh,:tentaikhoan,:matkhau,:hoten,:email,:ngaysinh,:sodienthoai)";

        $param = [':idthisinh' => $idthisinh, ':tentaikhoan' => $tentaikhoan, ':matkhau' => $matkhau, ':hoten' =>
        $hoten, ':email' => $email, ':ngaysinh' => $ngaysinh, ':sodienthoai' => $sodienthoai ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
 
        $sql="INSERT INTO duthi (idthisinh, idkythi) 
        VALUES (:idthisinh,:idkythi)";

        $param = [':idthisinh' => $idthisinh, ':idkythi' => $idkythi,];

        $this->set_query($sql, $param);
        return $this->execute_return_status();

    }
    public function get_list_classes()
    {
        $sql = "
        SELECT DISTINCT idkythi,tenkythi,mota,idqtv,matkhau FROM kythi";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_list_units($grade_id, $subject_id)
    {
        $sql = "SELECT idnhomcauhoi,vanbanbotro FROM nhomcauhoi WHERE loai = :subject_id";

        $param = [':subject_id' => $subject_id ];

        $this->set_query($sql, $param);
        return $this->load_rows();
    }
    public function get_list_levels_of_unit($grade_id, $subject_id, $unit)
    {
        $sql = "SELECT DISTINCT level_detail,questions.level_id, COUNT(questions.level_id) as total 
        FROM questions
        INNER JOIN levels ON levels.level_id = questions.level_id
        WHERE subject_id = :subject_id and grade_id = :grade_id and unit = :unit GROUP BY questions.level_id";

        $param = [ ':grade_id' => $grade_id, ':subject_id' => $subject_id, ':unit' => $unit ];

        $this->set_query($sql, $param);
        return $this->load_rows();
    }
    public function list_quest_of_unit($grade_id, $subject_id, $unit, $level_id, $limit)
    {
        $sql = "SELECT DISTINCT * FROM questions WHERE grade_id = :grade_id and 
        subject_id = :subject_id and unit = :unit and level_id = :level_id ORDER BY RAND() LIMIT $limit";

        $param = [ ':grade_id' => $grade_id, ':subject_id' => $subject_id, ':unit' => $unit, ':level_id' => $level_id ];

        $this->set_query($sql, $param);
        return $this->load_rows();
    }
    public function edit_class($class_id, $grade_id, $class_name, $teacher_id)
    {
        $sql="UPDATE classes set grade_id = :grade_id, class_name = :class_name, teacher_id = :teacher_id 
        where class_id = :class_id";

        $param = [ ':class_id' => $class_id, ':grade_id' => $grade_id, ':class_name' => $class_name,
        ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
    }
    public function toggle_test_status($test_code, $status_id)
    {
        $sql="UPDATE tests set status_id = :status_id where test_code = :test_code";

        $param = [ ':test_code' => $test_code, ':status_id' => $status_id ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function del_class($class_id)
    {
        $sql="DELETE FROM kythi where idkythi = :class_id";

        $param = [ ':class_id' => $class_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="DELETE FROM student_notifications where class_id = :class_id";

        $param = [ ':class_id' => $class_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="DELETE FROM classes where class_id = :class_id";
        
        $param = [ ':class_id' => $class_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql = "SELECT DISTINCT class_name FROM classes WHERE class_id = :class_id";
        
        $param = [ ':class_id' => $class_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()!='') {
            return false;
        }
        return true;
    }
    public function add_class($tenkythi, $mota, $matkhau, $idqtv)
    {
        $sql="INSERT INTO kythi (tenkythi,mota,matkhau,idqtv) VALUES (:tenkythi,:mota,:matkhau,:idqtv)";

        $param = [ ':tenkythi' => $tenkythi, ':mota' => $mota, ':matkhau' => $matkhau , ':idqtv'=>$idqtv];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function add_quest_to_test($test_code, $question_id)
    {
        $sql="INSERT INTO quest_of_test (test_code, question_id) VALUES (:test_code, :question_id)";

        $param = [ ':test_code' => $test_code, ':question_id' => $question_id ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function get_list_questions($column_order, $sort_order, $start, $offset)
    {
        $sql = "
        SELECT DISTINCT cauhoitracnghiem.idcauhoi,cauhoitracnghiem.vanbancauhoi,cauhoitracnghiem.diemtoidacauhoi,cauhoitracnghiem.loigiaichitiet,luachon1.luachondung,luachon1.vanbanluachon as A, luachon2.vanbanluachon as B, luachon3.vanbanluachon as C, luachon4.vanbanluachon as D
		FROM `cauhoitracnghiem`
        INNER JOIN luachon as luachon1 ON luachon1.idcauhoi = cauhoitracnghiem.idcauhoi and luachon1.sothutuluachon='A'
        INNER JOIN luachon as luachon2 ON luachon2.idcauhoi = cauhoitracnghiem.idcauhoi and luachon2.sothutuluachon='B'
        INNER JOIN luachon as luachon3 ON luachon3.idcauhoi = cauhoitracnghiem.idcauhoi and luachon3.sothutuluachon='C'
        INNER JOIN luachon as luachon4 ON luachon4.idcauhoi = cauhoitracnghiem.idcauhoi and luachon4.sothutuluachon='D'
        ";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_list_questions_search($keyword, $column_order, $sort_order, $start, $offset)
    {
        $sql = "
        SELECT DISTINCT questions.question_id,questions.question_content,questions.unit,grades.detail as grade_detail,
        questions.answer_a,questions.answer_b,questions.answer_c,questions.answer_d,questions.correct_answer,
        subjects.subject_detail,levels.level_detail FROM `questions`
        INNER JOIN grades ON grades.grade_id = questions.grade_id
        INNER JOIN levels ON levels.level_id = questions.level_id
        INNER JOIN subjects ON subjects.subject_id = questions.subject_id
        WHERE questions.question_id LIKE '%$keyword%' OR questions.question_content 
        LIKE '%$keyword%' OR questions.unit LIKE '%$keyword%' OR grades.detail 
        LIKE '%$keyword%' OR questions.answer_a LIKE '%$keyword%' OR questions.answer_b 
        LIKE '%$keyword%' OR questions.answer_c LIKE '%$keyword%' OR questions.answer_d 
        LIKE '%$keyword%' OR questions.correct_answer LIKE '%$keyword%' OR subjects.subject_detail 
        LIKE '%$keyword%' OR levels.level_detail LIKE '%$keyword%'
        ORDER BY $column_order $sort_order LIMIT $start, $offset";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_total_questions_search($keyword)
    {
        $sql = "
        SELECT DISTINCT count(questions.question_id) as total FROM `questions`
        INNER JOIN grades ON grades.grade_id = questions.grade_id
        INNER JOIN levels ON levels.level_id = questions.level_id
        INNER JOIN subjects ON subjects.subject_id = questions.subject_id
        WHERE questions.question_id LIKE '%$keyword%' OR questions.question_content 
        LIKE '%$keyword%' OR questions.unit LIKE '%$keyword%' OR grades.detail 
        LIKE '%$keyword%' OR questions.answer_a LIKE '%$keyword%' OR questions.answer_b 
        LIKE '%$keyword%' OR questions.answer_c LIKE '%$keyword%' OR questions.answer_d 
        LIKE '%$keyword%' OR questions.correct_answer LIKE '%$keyword%' OR subjects.subject_detail 
        LIKE '%$keyword%' OR levels.level_detail LIKE '%$keyword%'";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_list_tests()
    {
        $sql = "
        SELECT DISTINCT tests.test_code,tests.test_name,tests.password,tests.total_questions,tests.time_to_do,
        tests.note,grades.detail as grade,
        subjects.subject_detail,statuses.status_id,statuses.detail as status FROM `tests`
        INNER JOIN grades ON grades.grade_id = tests.grade_id
        INNER JOIN subjects ON subjects.subject_id = tests.subject_id
        INNER JOIN statuses ON statuses.status_id = tests.status_id";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_question($question_id)
    {
        $sql = "
        SELECT * FROM `questions` WHERE question_id = :question_id";

        $param = [ ':question_id' => $question_id ];

        $this->set_query($sql, $param);
        return $this->load_row();
    }
    public function get_list_statuses()
    {
        $sql = "
        SELECT DISTINCT * FROM `statuses`";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function edit_question(
        $question_id,
        $subject_id,
        $question_content,
        $grade_id,
        $unit,
        $answer_a,
        $answer_b,
        $answer_c,
        $answer_d,
        $correct_answer,
        $level_id
    ) {
        $sql="UPDATE questions set question_content = :question_content, grade_id = :grade_id, unit = :unit, 
        answer_a = :answer_a, answer_b = :answer_b, answer_c = :answer_c, answer_d = :answer_d, 
        correct_answer = :correct_answer, subject_id = :subject_id, level_id = :level_id 
        where question_id = :question_id";

        $param = [ ':question_id' => $question_id, ':subject_id' => $subject_id,
        ':question_content' => $question_content, ':grade_id' => $grade_id,
        ':unit' => $unit, ':answer_a' => $answer_a, ':answer_b' => $answer_b,
        ':answer_c' => $answer_c, ':answer_d' => $answer_d, ':correct_answer' => $correct_answer,
        ':level_id' => $level_id ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function del_question($question_id)
    {
        $sql="DELETE FROM cauhoitracnghiem where idcauhoi = :idcauhoi";
        $param = [ ':idcauhoi' => $question_id ];
        $this->set_query($sql, $param);
        $this->execute_return_status();


        $sql="DELETE FROM luachon where idcauhoi = :idcauhoi";
        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="DELETE FROM gomnhungcauhoi where idcauhoi = :idcauhoi";
        $this->set_query($sql, $param);
        return $this->execute_return_status();

    }
    public function add_question(
        $subject_id,
        $question_detail,
        $answer_f,
        $mark,
        $answer_a,
        $answer_b,
        $answer_c,
        $answer_d,
        $correct_answer
    ) {
        $sql = "SELECT DISTINCT COUNT(*) as total FROM cauhoitracnghiem";

        $this->set_query($sql);
        $idcauhoi= 1+$this->load_row()->total;

        $sql="INSERT INTO cauhoitracnghiem 
        (idcauhoi,loigiaichitiet,vanbancauhoi,diemtoidacauhoi) 
        VALUES (:idcauhoi,:loigiaichitiet,:vanbancauhoi,:diemtoidacauhoi)";

        $param = [':idcauhoi' => $idcauhoi,  ':vanbancauhoi' => $question_detail,
        ':loigiaichitiet' => $answer_f,
        ':diemtoidacauhoi' => $mark];

        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="INSERT INTO gomnhungcauhoi 
        (idcauhoi,idnhomcauhoi) 
        VALUES (:idcauhoi,:idnhomcauhoi)";
        $this->set_query($sql,[':idcauhoi' => $idcauhoi, ':idnhomcauhoi' => $subject_id]);
        $this->execute_return_status();

        $param = [':idcauhoi' => $idcauhoi,':diem' => $mark, ':vanbanluachon' => $answer_a, ':sothutuluachon' => 'A', ':luachondung' => $correct_answer ];
        $sql="INSERT INTO luachon 
        (sothutuluachon,idcauhoi,luachondung,diem,vanbanluachon) 
        VALUES (:sothutuluachon,:idcauhoi,:luachondung,:diem,:vanbanluachon)";
        $this->set_query($sql, $param);
        $this->execute_return_status();

        $param = [':idcauhoi' => $idcauhoi,':diem' => $mark, ':vanbanluachon' => $answer_b, ':sothutuluachon' => 'B', ':luachondung' => $correct_answer ];
        $sql="INSERT INTO luachon 
        (sothutuluachon,idcauhoi,luachondung,diem,vanbanluachon) 
        VALUES (:sothutuluachon,:idcauhoi,:luachondung,:diem,:vanbanluachon)";
        $this->set_query($sql, $param);
        $this->execute_return_status();

        $param = [':idcauhoi' => $idcauhoi,':diem' => $mark, ':vanbanluachon' => $answer_c, ':sothutuluachon' => 'C', ':luachondung' => $correct_answer ];
        $sql="INSERT INTO luachon 
        (sothutuluachon,idcauhoi,luachondung,diem,vanbanluachon) 
        VALUES (:sothutuluachon,:idcauhoi,:luachondung,:diem,:vanbanluachon)";
        $this->set_query($sql, $param);
        $this->execute_return_status();

        $param = [':idcauhoi' => $idcauhoi,':diem' => $mark, ':vanbanluachon' => $answer_d, ':sothutuluachon' => 'D', ':luachondung' => $correct_answer ];
        $sql="INSERT INTO luachon 
        (sothutuluachon,idcauhoi,luachondung,diem,vanbanluachon) 
        VALUES (:sothutuluachon,:idcauhoi,:luachondung,:diem,:vanbanluachon)";
        $this->set_query($sql, $param);
        return $this->execute_return_status();

    }
    public function add_test  (
            $tenbaithi,
            $motabaithi,
            $passwordbaithi,
            $idnhomcauhoi,
            $loaibaithi,
            $thoiluongbaithi,
            $thoigianchophepbatdau ,
            $thoigiandongbaithi,
            $diemtoida,
            $idkythi
    ) {
        $sql="SELECT COUNT(*) as total FROM baithikynang";
        $this->set_query($sql) ;
        $idbaithi = 1+$this->load_row()->total;

        $sql="INSERT INTO baithikynang
        (idbaithi,	tenbaithi,	motabaithi,	passwordbaithi,	loaibaithi,	thoiluongbaithi,thoigianchophepbatdau, thoigiandongbaithi, diemtoida) 
        VALUES
        (:idbaithi,:tenbaithi,:motabaithi,:passwordbaithi,:loaibaithi,:thoiluongbaithi,:thoigianchophepbatdau, :thoigiandongbaithi, :diemtoida)";

        $param = [ ':idbaithi' => $idbaithi, ':tenbaithi' => $tenbaithi,
        ':motabaithi' => $motabaithi, ':passwordbaithi' => $passwordbaithi, ':loaibaithi' => $loaibaithi,
        ':thoiluongbaithi' => $thoiluongbaithi,  ':diemtoida' => $diemtoida, ':thoigianchophepbatdau'=>$thoigianchophepbatdau,':thoigiandongbaithi'=> $thoigiandongbaithi ];
        $this->set_query($sql, $param);
        $this->execute_return_status();

        $sql="INSERT INTO gomcacbaithi
        (idbaithi,	idkythi) 
        VALUES
        (:idbaithi,:idkythi)";
        $this->set_query($sql, [':idbaithi' => $idbaithi, ':idkythi' => $idkythi]);
        return $this->execute_return_status();
    }
    public function insert_notification($notification_id, $username, $name, $notification_title, $notification_content)
    {
        $sql="INSERT INTO 
        notifications (notification_id,username,name,notification_title,notification_content,time_sent) 
        VALUES ($notification_id,'$username','$name','$notification_title','$notification_content',NOW())";

        $param = [ ':notification_id' => $notification_id, ':username' => $username,
        ':name' => $name, ':notification_title' => $notification_title,
        ':notification_content' => $notification_content ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function notify_teacher($ID, $teacher_id)
    {
        $sql="INSERT INTO teacher_notifications (notification_id,teacher_id) VALUES (:ID,:teacher_id)";

        $param = [ ':ID' => $ID, ':teacher_id' => $teacher_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
    }
    public function notify_class($ID, $class_id)
    {
        $sql="INSERT INTO student_notifications (notification_id,class_id) VALUES (:ID,:class_id)";

        $param = [ ':ID' => $ID, ':class_id' => $class_id ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
    }
    public function get_teacher_notifications()
    {
        $sql = "
        SELECT DISTINCT notifications.notification_id, notifications.notification_title,
        notifications.notification_content, notifications.username,notifications.name,
        teachers.name as receive_name,teachers.username as receive_username,notifications.time_sent
        FROM teacher_notifications
        INNER JOIN notifications ON notifications.notification_id = teacher_notifications.notification_id
        INNER JOIN teachers ON teachers.teacher_id = teacher_notifications.teacher_id
        ORDER BY `ID` DESC";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_student_notifications()
    {
        $sql = "
        SELECT DISTINCT notifications.notification_id, notifications.notification_title,
        notifications.notification_content, notifications.username,notifications.name,
        classes.class_name,notifications.time_sent FROM student_notifications
        INNER JOIN notifications ON notifications.notification_id = student_notifications.notification_id
        INNER JOIN classes ON classes.class_id = student_notifications.class_id
        ORDER BY `ID` DESC";

        $this->set_query($sql);
        return $this->load_rows();
    }
    public function get_test_score($test_code)
    {
        $sql = "SELECT DISTINCT * FROM `scores` INNER JOIN students ON scores.student_id = students.student_id
        INNER JOIN classes ON students.class_id = classes.class_id
        WHERE test_code = :test_code";

        $param = [ ':test_code' => $test_code ];

        $this->set_query($sql, $param);
        return $this->load_rows();
    }
    public function update_profiles($username, $name, $email, $password, $gender, $birthday)
    {
        $sql="UPDATE admins set email = :email, password = :password,
        name = :name, gender_id = :gender, birthday = :birthday where username = :username";

        $param = [ ':username' => $username, ':name' => $name, ':email' => $email,
        ':password' => $password, ':gender' => $gender, ':birthday' => $birthday ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
        return true;
    }
    public function update_avatar($avatar, $username)
    {
        $sql="UPDATE admins set avatar = :avatar where username = :username";

        $param = [ ':avatar' => $avatar, ':username' => $username ];

        $this->set_query($sql, $param);
        $this->execute_return_status();
    }
    public function get_total_student()
    {
        $sql = "SELECT DISTINCT COUNT(student_id) as total FROM students";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_admin()
    {
        $sql = "SELECT DISTINCT  COUNT(admin_id) as total FROM admins";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_teacher()
    {
        $sql = "SELECT DISTINCT  COUNT(teacher_id) as total FROM teachers";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_class()
    {
        $sql = "SELECT DISTINCT COUNT(class_id) as total FROM classes";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_subject()
    {
        $sql = "SELECT DISTINCT COUNT(subject_id) as total FROM subjects";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_question()
    {
        $sql = "SELECT DISTINCT COUNT(*) as total FROM cauhoitracnghiem";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_grade()
    {
        $sql = "SELECT DISTINCT COUNT(grade_id) as total FROM grades";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function get_total_test()
    {
        $sql = "SELECT DISTINCT COUNT(test_code) as total FROM tests";

        $this->set_query($sql);
        return $this->load_row()->total;
    }
    public function edit_subject($subject_id, $subject_detail)
    {
        $sql = "SELECT DISTINCT subject_detail FROM subjects WHERE subject_id = :subject_id";

        $param = [ ':subject_id' => $subject_id ];

        $this->set_query($sql, $param);
        if ($this->load_row()=='') {
            return false;
        }

        $sql="UPDATE subjects set subject_detail = :subject_detail where subject_id = :subject_id";

        $param = [ ':subject_detail' => $subject_detail, ':subject_id' => $subject_id ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function del_subject($subject_id)
    {
        $sql="DELETE FROM subjects where subject_id = :subject_id";

        $param = [ ':subject_id' => $subject_id ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function add_subject($subject_detail)
    {
        $sql="INSERT INTO subjects (subject_detail) VALUES (:subject_detail)";

        $param = [ ':subject_detail' => $subject_detail ];

        $this->set_query($sql, $param);
        return $this->execute_return_status();
    }
    public function get_quest_of_test($test_code)
    {
        $sql = "SELECT DISTINCT * FROM `quest_of_test`
        INNER JOIN questions ON quest_of_test.question_id = questions.question_id
        WHERE test_code = :test_code";

        $param = [ ':test_code' => $test_code ];

        $this->set_query($sql, $param);
        return $this->load_rows();
    }
}
