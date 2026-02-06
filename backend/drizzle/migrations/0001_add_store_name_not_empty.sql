ALTER TABLE IF EXISTS "public"."stores"
ADD CONSTRAINT stores_name_not_empty CHECK (char_length(name) > 0);
