--UPDATE coupon 
--SET business_id = (select id from business where name like 'Noodles')
--WHERE id = 2;

--select id, name from business

select c.deal_text, b.name
from coupon c
INNER JOIN business b
on c.business_id = b.id

--
--INSERT INTO coupon
--(	business_id,
--	start_of_deal,
--	end_of_deal,
--	deal_text
--)
--VALUES
--(
--	(SELECT id from business where name like 'Tommy Nevins'),
--	'Thursday 6PM',
--	'Thursday 9PM',
--	'$3 Guinesses'
--)