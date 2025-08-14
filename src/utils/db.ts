// 데이터베이스 유틸리티 함수

import type { Member, MembershipType, PrePurchaseApplication, Inquiry, ActivityLog, Bindings } from '../types';

export class DatabaseService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // 회원 관련
  async getMemberByEmail(email: string): Promise<Member | null> {
    try {
      const result = await this.db.prepare(
        'SELECT * FROM members WHERE email = ? LIMIT 1'
      ).bind(email).first();
      return result as Member || null;
    } catch (error) {
      console.error('Error getting member by email:', error);
      return null;
    }
  }

  async getMemberById(id: number): Promise<Member | null> {
    try {
      const result = await this.db.prepare(
        'SELECT * FROM members WHERE id = ? LIMIT 1'
      ).bind(id).first();
      return result as Member || null;
    } catch (error) {
      console.error('Error getting member by id:', error);
      return null;
    }
  }

  async createMember(member: Member): Promise<Member | null> {
    try {
      const result = await this.db.prepare(`
        INSERT INTO members (email, password_hash, name, phone, birth_date, nationality, preferred_language, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        RETURNING *
      `).bind(
        member.email,
        member.password_hash,
        member.name,
        member.phone || null,
        member.birth_date || null,
        member.nationality || 'KR',
        member.preferred_language || 'ko'
      ).first();
      return result as Member || null;
    } catch (error) {
      console.error('Error creating member:', error);
      return null;
    }
  }

  async updateMemberStatus(id: number, status: string): Promise<boolean> {
    try {
      const result = await this.db.prepare(
        'UPDATE members SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(status, id).run();
      return result.success;
    } catch (error) {
      console.error('Error updating member status:', error);
      return false;
    }
  }

  async updateLastLogin(id: number): Promise<boolean> {
    try {
      const result = await this.db.prepare(
        'UPDATE members SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(id).run();
      return result.success;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }

  // 회원권 타입 관련
  async getAllMembershipTypes(): Promise<MembershipType[]> {
    try {
      const result = await this.db.prepare(
        'SELECT * FROM membership_types WHERE is_active = 1 ORDER BY price ASC'
      ).all();
      return result.results as MembershipType[];
    } catch (error) {
      console.error('Error getting membership types:', error);
      return [];
    }
  }

  async getMembershipTypeById(id: number): Promise<MembershipType | null> {
    try {
      const result = await this.db.prepare(
        'SELECT * FROM membership_types WHERE id = ? LIMIT 1'
      ).bind(id).first();
      return result as MembershipType || null;
    } catch (error) {
      console.error('Error getting membership type by id:', error);
      return null;
    }
  }

  // 사전구매 신청 관련
  async createPrePurchaseApplication(application: PrePurchaseApplication): Promise<PrePurchaseApplication | null> {
    try {
      const result = await this.db.prepare(`
        INSERT INTO pre_purchase_applications 
        (member_id, membership_type_id, preferred_floor, preferred_orientation, payment_method, deposit_amount, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        RETURNING *
      `).bind(
        application.member_id,
        application.membership_type_id,
        application.preferred_floor || null,
        application.preferred_orientation || null,
        application.payment_method || 'full_payment',
        application.deposit_amount || 0,
        application.total_amount
      ).first();
      return result as PrePurchaseApplication || null;
    } catch (error) {
      console.error('Error creating pre-purchase application:', error);
      return null;
    }
  }

  async getApplicationsByMember(memberId: number): Promise<PrePurchaseApplication[]> {
    try {
      const result = await this.db.prepare(`
        SELECT pa.*, mt.name as membership_name, mt.name_ko as membership_name_ko
        FROM pre_purchase_applications pa
        JOIN membership_types mt ON pa.membership_type_id = mt.id
        WHERE pa.member_id = ?
        ORDER BY pa.created_at DESC
      `).bind(memberId).all();
      return result.results as PrePurchaseApplication[];
    } catch (error) {
      console.error('Error getting applications by member:', error);
      return [];
    }
  }

  // 문의사항 관련
  async createInquiry(inquiry: Inquiry): Promise<Inquiry | null> {
    try {
      const result = await this.db.prepare(`
        INSERT INTO inquiries (member_id, name, email, phone, subject, message, category, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        RETURNING *
      `).bind(
        inquiry.member_id || null,
        inquiry.name,
        inquiry.email,
        inquiry.phone || null,
        inquiry.subject,
        inquiry.message,
        inquiry.category || 'general'
      ).first();
      return result as Inquiry || null;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      return null;
    }
  }

  // 활동 로그 관련
  async createActivityLog(log: ActivityLog): Promise<boolean> {
    try {
      const result = await this.db.prepare(`
        INSERT INTO activity_logs (member_id, action, description, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        log.member_id || null,
        log.action,
        log.description || null,
        log.ip_address || null,
        log.user_agent || null
      ).run();
      return result.success;
    } catch (error) {
      console.error('Error creating activity log:', error);
      return false;
    }
  }

  // 뉴스레터 구독 관련
  async subscribeNewsletter(email: string, name?: string, language?: string): Promise<boolean> {
    try {
      const result = await this.db.prepare(`
        INSERT OR REPLACE INTO newsletter_subscriptions (email, name, language, is_active)
        VALUES (?, ?, ?, 1)
      `).bind(email, name || null, language || 'ko').run();
      return result.success;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return false;
    }
  }

  // 관리자 기능
  async getAllMembers(limit: number = 50, offset: number = 0): Promise<Member[]> {
    try {
      const result = await this.db.prepare(`
        SELECT id, email, name, phone, nationality, preferred_language, role, membership_type, status, created_at, last_login_at
        FROM members
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();
      return result.results as Member[];
    } catch (error) {
      console.error('Error getting all members:', error);
      return [];
    }
  }

  async getAllApplications(limit: number = 50, offset: number = 0): Promise<PrePurchaseApplication[]> {
    try {
      const result = await this.db.prepare(`
        SELECT pa.*, m.name as member_name, m.email as member_email, mt.name as membership_name, mt.name_ko as membership_name_ko
        FROM pre_purchase_applications pa
        JOIN members m ON pa.member_id = m.id
        JOIN membership_types mt ON pa.membership_type_id = mt.id
        ORDER BY pa.created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();
      return result.results as PrePurchaseApplication[];
    } catch (error) {
      console.error('Error getting all applications:', error);
      return [];
    }
  }

  async getAllInquiries(limit: number = 50, offset: number = 0): Promise<Inquiry[]> {
    try {
      const result = await this.db.prepare(`
        SELECT *
        FROM inquiries
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();
      return result.results as Inquiry[];
    } catch (error) {
      console.error('Error getting all inquiries:', error);
      return [];
    }
  }
}