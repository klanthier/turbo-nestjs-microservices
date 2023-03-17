-- Enable Row Level Security
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "Post" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY post_isolation_policy ON "Post" USING (string_to_array("client_key", ',') && string_to_array(current_setting('app.client_keys', true), ','));
