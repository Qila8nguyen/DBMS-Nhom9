SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone="+00:00";

CREATE table`baithikynang`(
    idbaithi varchar(255) NOT NULL,
    tenbaithi varchar(255),
    motabaithi text,
    passwordbaithi varchar(255),
    loaibaithi varchar(255),
    thoiluongbaithi time,
    thoigianchophepbatdau timestamp,
    thoigiandongbaithi timestamp,
    diemtoida real
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`bangtraloicuathisinh`(
    idbangtraloi varchar(255) NOT NULL,
    idbaithi varchar(255),
    hovatenthisinhtraloi varchar(255),
    ngaygiothuchien timestamp,
    thoiluongthuchien time,
    tongdiembaithi real,
    idthisinh varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`cauhoitracnghiem`(
    idcauhoi varchar(255) NOT NULL,
    loigiaichitiet text,
    vanbancauhoi text,
    diemtoidacauhoi real
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`cautraloi`(
    sothutudaluachon varchar(255),
    idcauhoi varchar(255) NOT NULL,
    idbangtraloi varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`demo`(
    id int(11) NOT NULL,
    name varchar(200) DEFAULT '',
    hint varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`duthi`(
    idkythi varchar(255) NOT NULL,
    idthisinh varchar(255) NOT NULL,
    tongdiemkythi real
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`gomcacbaithi`(
    idkythi varchar(255) NOT NULL,
    idbaithi varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`gomnhomcauhoi`(
    idbaithi varchar(255) NOT NULL,
    idnhomcauhoi varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`gomnhungcauhoi`(
    idnhomcauhoi varchar(255) NOT NULL,
    idcauhoi varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`idthisinhdaduthi`(
    idkythi varchar(255) NOT NULL,
    idthisinhdaduthi varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`kythi`(
    idkythi varchar(255) NOT NULL,
    tenkythi varchar(255) NOT NULL,
    mota text,
    matkhau varchar(50) NOT NULL,
    tentaikhoan varchar(100) NOT NULL,
    idthisinhdaduthi varchar(255),
    idqtv varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`luachon`(
    sothutuluachon varchar(255) NOT NULL,
    idcauhoi varchar(255) NOT NULL,
    luachondung varchar(255),
    diem real,
    vanbanluachon text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`nhomcauhoi`(
    idnhomcauhoi varchar(255) NOT NULL,
    vanbanbotro text,
    loai varchar(255),
    diemtoidanhomcauhoi real
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`quantrivien`(
    idqtv varchar(255) NOT NULL,
    hoten varchar(255) NOT NULL,
    matkhau varchar(50) NOT NULL,
    tentaikhoan varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE table`thisinh`(
    idthisinh varchar(255) NOT NULL,
    hoten varchar(255) NOT NULL,
    ngaysinh date NOT NULL,
    sodienthoai bigint NOT NULL,
    email varchar(255) NOT NULL,
    matkhau varchar(50) NOT NULL,
    tentaikhoan varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table `baithikynang`
    ADD CONSTRAINT baithikynang_pkey PRIMARY KEY (idbaithi);
alter table `bangtraloicuathisinh`
    ADD CONSTRAINT bangtraloicuathisinh_pkey PRIMARY KEY (idbangtraloi);
alter table `cauhoitracnghiem`
    ADD CONSTRAINT cauhoitracnghiem_pkey PRIMARY KEY (idcauhoi);
alter table `cautraloi`
    ADD CONSTRAINT cautraloi_pkey PRIMARY KEY (idcauhoi, idbangtraloi);
alter table `demo`
    ADD CONSTRAINT demo_pkey PRIMARY KEY (id);
alter table `duthi`
    ADD CONSTRAINT duthi_pkey PRIMARY KEY (idkythi, idthisinh);
alter table `gomcacbaithi`
    ADD CONSTRAINT gomcacbaithi_pkey PRIMARY KEY (idkythi, idbaithi);
alter table `gomnhomcauhoi`
    ADD CONSTRAINT gomnhomcauhoi_pkey PRIMARY KEY (idbaithi, idnhomcauhoi);
alter table `gomnhungcauhoi`
    ADD CONSTRAINT gomnhungcauhoi_pkey PRIMARY KEY (idnhomcauhoi, idcauhoi);
alter table `idthisinhdaduthi`
    ADD CONSTRAINT idthisinhdaduthi_pkey PRIMARY KEY (idkythi, idthisinhdaduthi);
alter table `kythi`
    ADD CONSTRAINT kythi_pkey PRIMARY KEY (idkythi);
alter table `luachon`
    ADD CONSTRAINT luachon_pkey PRIMARY KEY (sothutuluachon, idcauhoi);
alter table `nhomcauhoi`
    ADD CONSTRAINT nhomcauhoi_pkey PRIMARY KEY (idnhomcauhoi);
alter table `quantrivien`
    ADD CONSTRAINT quantrivien_pkey PRIMARY KEY (idqtv);
alter table `thisinh`
    ADD CONSTRAINT thisinh_pkey PRIMARY KEY (idthisinh);
ALTER TABLE `quantrivien`
ADD KEY `role` (`permission`);
ALTER TABLE `quantrivien`
	ADD CONSTRAINT `role` FOREIGN KEY (`permission`) REFERENCES `permissions` (`permission`);