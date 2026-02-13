-- Migracion: Tabla de logs de emails
-- Control de limite diario de emails (300/dia Brevo)

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_success ON email_logs(success, sent_at);

COMMENT ON TABLE email_logs IS 'Registro de todos los emails enviados para control de limites';
COMMENT ON COLUMN email_logs.email_type IS 'Tipo: verification, password_reset, notification, generic';
COMMENT ON COLUMN email_logs.success IS 'Si el email se envio exitosamente';
COMMENT ON COLUMN email_logs.error_message IS 'Mensaje de error si el envio fallo';

CREATE OR REPLACE FUNCTION cleanup_old_email_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM email_logs
    WHERE sent_at < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE VIEW v_email_stats_today AS
SELECT 
    email_type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE success = true) as sent,
    COUNT(*) FILTER (WHERE success = false) as failed,
    MIN(sent_at) as first_email,
    MAX(sent_at) as last_email
FROM email_logs
WHERE sent_at >= CURRENT_DATE
  AND sent_at < CURRENT_DATE + INTERVAL '1 day'
GROUP BY email_type;

CREATE OR REPLACE VIEW v_email_stats_monthly AS
SELECT 
    DATE(sent_at) as date,
    email_type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE success = true) as sent,
    COUNT(*) FILTER (WHERE success = false) as failed
FROM email_logs
WHERE sent_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND sent_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY DATE(sent_at), email_type
ORDER BY date DESC, email_type;

CREATE OR REPLACE FUNCTION check_daily_email_limit(p_limit INTEGER DEFAULT 300)
RETURNS TABLE (
    can_send BOOLEAN,
    count_emails BIGINT,
    limit_emails INTEGER,
    remaining INTEGER
) AS $$
DECLARE
    today_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO today_count
    FROM email_logs
    WHERE sent_at >= CURRENT_DATE
      AND sent_at < CURRENT_DATE + INTERVAL '1 day'
      AND success = true;
    
    RETURN QUERY SELECT 
        today_count < p_limit as can_send,
        today_count as count_emails,
        p_limit as limit_emails,
        GREATEST(0, p_limit - today_count)::INTEGER as remaining;
END;
$$ LANGUAGE plpgsql;