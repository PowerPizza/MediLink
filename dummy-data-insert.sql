-- =====================================================
-- TEST DATA : HOSPITALS
-- 7 Records (5 Active, 2 Inactive)
-- =====================================================
INSERT INTO public.hospitals
(id, hospital_name, city, hospital_address, is_active)
VALUES
(1, 'City Care Hospital', 'New Delhi', '12 MG Road, New Delhi', true),
(2, 'Sunrise Medical Center', 'Mumbai', '45 Park Avenue, Mumbai', true),
(3, 'Green Valley Hospital', 'Bengaluru', '98 Residency Road, Bengaluru', true),
(4, 'Hope Multi Speciality Hospital', 'Pune', '16 FC Road, Pune', true),
(5, 'Metro Health Institute', 'Hyderabad', '210 Jubilee Hills, Hyderabad', true),
(6, 'Royal Wellness Hospital', 'Chennai', '5 Anna Salai, Chennai', false),
(7, 'Lifeline Hospital', 'Jaipur', '71 MI Road, Jaipur', false)
ON CONFLICT DO NOTHING;



-- =====================================================
-- TEST DATA : DOCTORS
-- 12 Records (9 Active, 3 Inactive)
-- =====================================================

INSERT INTO public.doctors
(full_name, gmail, phone_no, specialization, experience, qualifications, pfp_url, biometric_method, verification_code, doctor_id, pin, agreed_pin_warn, accepted_terms, hospital_id, is_active)
VALUES
('John Carter','john.carter@gmail.com','9876500001','Cardiology',8,'MBBS, MD','','UNKNOWN','183-291','A8J3KD91LM2QX7WP','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,1,true),

('Emily Watson','emily.watson@gmail.com','9876500002','Neurology',10,'MBBS, DM','','UNKNOWN','291-443','Q2WP9ZS8NX4TR6LM','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,2,true),

('David Miller','david.miller@gmail.com','9876500003','Orthopedics',6,'MBBS, MS','','UNKNOWN','512-984','L0PA4MR7YU6EK9DN','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,3,true),

('Sophia Brown','sophia.brown@gmail.com','9876500004','Dermatology',5,'MBBS, MD','','UNKNOWN','710-188','RT8NX5AK9QP2ZM6J','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,4,true),

('Michael Adams','michael.adams@gmail.com','9876500005','Pediatrics',9,'MBBS, DCH','','UNKNOWN','901-375','VC7TY4QW8ZX1HJ2P','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,5,true),

('Olivia Wilson','olivia.wilson@gmail.com','9876500006','Gynecology',12,'MBBS, MS','','UNKNOWN','483-629','MN4PQ8WE5LR2KTX9','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,6,true),

('Daniel Scott','daniel.scott@gmail.com','9876500007','ENT',7,'MBBS, MS','','UNKNOWN','236-805','HJ5VK8MX2QW9PLRA','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,7,true),

('Grace Taylor','grace.taylor@gmail.com','9876500008','Psychiatry',11,'MBBS, MD','','UNKNOWN','775-194','PX7MW2RL4QZ8TYKH','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,2,true),

('Ryan Lewis','ryan.lewis@gmail.com','9876500009','General Medicine',4,'MBBS','','UNKNOWN','348-552','KD9TL6MX1PQ7ZWAR','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,3,true),

('Emma Hall','emma.hall@gmail.com','9876500010','Radiology',13,'MBBS, MD','','UNKNOWN','608-143','BT5RP8XN2LQ9WZMJ','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,4,false),

('Matthew Young','matthew.young@gmail.com','9876500011','Urology',8,'MBBS, MS','','UNKNOWN','815-771','YR6QK2MW8PN4TZLX','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,5,false),

('Charlotte King','charlotte.king@gmail.com','9876500012','Oncology',15,'MBBS, DM','','UNKNOWN','122-490','ZM8PX4RT6LW9QKVA','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg',true,true,1,false);



-- =====================================================
-- TEST DATA : PATIENTS
-- 20 Records
-- 16 Active / 4 Inactive
-- 12 Male / 8 Female
-- =====================================================

INSERT INTO public.patients
(fullname, gender, phone_no, pfp_url, gmail, password, patient_id, age, is_active)
VALUES
('Aarav Sharma','MALE','9000000001','','aarav.sharma@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTA83LKQ91MX7ZWR',24,true),

('Vihaan Patel','MALE','9000000002','','vihaan.patel@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTQ71MRX92LP8KWA',31,true),

('Arjun Singh','MALE','9000000003','','arjun.singh@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTN82ZXW6MKL1QRA',27,true),

('Aditya Verma','MALE','9000000004','','aditya.verma@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTY45QKL8MWR2XNA',29,true),

('Rohan Gupta','MALE','9000000005','','rohan.gupta@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTP81LMQ7WRX4AZN',38,true),

('Kabir Joshi','MALE','9000000006','','kabir.joshi@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTX94MKL2QWA7ZRP',22,true),

('Yash Mehta','MALE','9000000007','','yash.mehta@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTB64WQR9LMX8APK',41,true),

('Rahul Nair','MALE','9000000008','','rahul.nair@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTM73ZXP5QLA2KWR',35,true),

('Karan Malhotra','MALE','9000000009','','karan.malhotra@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTJ18MWR4QPX9LKA',26,true),

('Siddharth Rao','MALE','9000000010','','siddharth.rao@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTW38LKA9QRM5XNP',44,true),

('Nikhil Kapoor','MALE','9000000011','','nikhil.kapoor@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTL92QWR5MXK7AZP',32,false),

('Aman Bansal','MALE','9000000012','','aman.bansal@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTA56RMX8QWL3KZN',23,false),

('Ananya Sharma','FEMALE','9000000013','','ananya.sharma@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTF82KLM1QWX9ARP',21,true),

('Priya Kapoor','FEMALE','9000000014','','priya.kapoor@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTD72LWX5QMK8RPA',28,true),

('Sneha Gupta','FEMALE','9000000015','','sneha.gupta@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTH39QWX7LKM2APR',34,true),

('Kavya Iyer','FEMALE','9000000016','','kavya.iyer@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTR91LMQ8WKA4XZN',30,true),

('Neha Jain','FEMALE','9000000017','','neha.jain@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTG47MWX2LQA9KRP',36,true),

('Pooja Verma','FEMALE','9000000018','','pooja.verma@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTU68LKQ4MXA7RWP',25,true),

('Ishita Roy','FEMALE','9000000019','','ishita.roy@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTV24QWM7LKX1APR',42,false),

('Riya Sen','FEMALE','9000000020','','riya.sen@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$VOGRNWt1TAWhRJcxhsStyg$2+DAI7RuW3+rau1GAE6k4BFAROVqicfAdVwhS+152jg','PTZ85LQR2MWK6AXP',27,false);
